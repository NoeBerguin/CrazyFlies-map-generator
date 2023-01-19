#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "FreeRTOS.h"
#include "app.h"
#include "debug.h"
#include "droneController.h"
#include "log.h"
#include "param.h"
#include "stateController.h"
#include "task.h"
#include "variables.h"
#include "explore.h"


#define DEBUG_MODULE "PUSH"

void updateMap(struct ExploreVariable *variables) {
   int x = ((logGetFloat(logGetVarId("kalman", "stateX")) * 100) /
            variables->map.grid_size) +
           (variables->map.width / 2);
   int y = ((logGetFloat(logGetVarId("kalman", "stateY")) * 100) /
            variables->map.grid_size) +
           (variables->map.width / 2);
   int pos = y * variables->map.width + x;
   variables->map.data[pos].type = '0';
}

void setSpeedPoint(setpoint_t *setpoint, float vx, float vy, float z,
                   float yawrate) {
   setpoint->mode.z = modeAbs;
   setpoint->position.z = z;
   setpoint->mode.yaw = modeVelocity;
   setpoint->attitudeRate.yaw = yawrate;
   setpoint->mode.x = modeVelocity;
   setpoint->mode.y = modeVelocity;
   setpoint->velocity.x = vx;
   setpoint->velocity.y = vy;
   setpoint->velocity_body = true;
}

static const uint16_t unlockThLow = 100;
static const uint16_t unlockThHigh = 300;
// static const uint16_t stoppedTh = 500;
static const float velMax = 1.0f;
static const uint16_t radius = 300;
static const float height_sp = 0.2f;

void initialiseExploreVariables(struct ExploreVariable *variables,
                                int *GLOBAL_STATE) {
   variables->idUp = logGetVarId("range", "up");
   variables->idLeft = logGetVarId("range", "left");
   variables->idRight = logGetVarId("range", "right");
   variables->idFront = logGetVarId("range", "front");
   variables->idBack = logGetVarId("range", "back");
   variables->idPositioningDeck = paramGetVarId("deck", "bcFlow2");
   variables->idMultiranger = paramGetVarId("deck", "bcMultiranger");
   variables->factor = velMax / radius;
   variables->velFront = RESET;
   variables->velSide = RESET;
   variables->state = unlocked;
   variables->map = generateMap();
   variables->trajectory.current_target_index = RESET;
   variables->trajectory.state = RESET;
   variables->trajectory.list.size = RESET;
   variables->mode = AUTOMATIC_MODE;
   variables->GLOBAL_STATE = GLOBAL_STATE;
   variables->battery_lvl = MAXIMUM_BATTERY_LVL;
   variables->landing_lock = LOCK_ON;
   variables->battery_check_index = RESET;
   variables->battery_lock = LOCK_ON;
   variables->battery_average = MAXIMUM_BATTERY_LVL;
}

float detectSideColision(struct ExploreVariable *variables) {
   uint16_t left = logGetUint(variables->idLeft);
   uint16_t right = logGetUint(variables->idRight);
   uint16_t left_o = radius - MIN(left, radius);
   uint16_t right_o = radius - MIN(right, radius);
   float l_comp = (-1) * left_o * variables->factor;
   float r_comp = right_o * variables->factor;
   return r_comp + l_comp;
}

float detectFrontColision(struct ExploreVariable *variables) {
   uint16_t front = logGetUint(variables->idFront);
   uint16_t back = logGetUint(variables->idBack);
   uint16_t front_o = radius - MIN(front, radius);
   uint16_t back_o = radius - MIN(back, radius);
   float f_comp = (-1) * front_o * variables->factor;
   float b_comp = back_o * variables->factor;
   return b_comp + f_comp;
}

void setDroneAltitude(struct ExploreVariable *variables, uint16_t up) {
   uint16_t up_o = radius - MIN(up, radius);
   variables->altitude = height_sp - up_o / 1000.0f;
}

void move(struct ExploreVariable *variables) {
   setSpeedPoint(&variables->setpoint, variables->velFront, variables->velSide,
                 variables->altitude, 0);
   commanderSetSetpoint(&variables->setpoint, 3);
}

void moveAutomatic(struct ExploreVariable *variables) {
   if (variables->moveAutomatic_index > MAX_INDEX) {
      randomDirection(variables);
      variables->moveAutomatic_index = RESET;
   }
   move(variables);
   variables->moveAutomatic_index += 1;
}

void randomDirection(struct ExploreVariable *variables) {
   int direction = rand() % 5;
   switch (direction) {
      case 1:
         variables->velFront = AUTO_SPEED;
         variables->velSide = RESET;
         break;

      case 2:
         variables->velFront = -AUTO_SPEED;
         variables->velSide = RESET;
         break;

      case 3:
         variables->velSide = AUTO_SPEED;
         variables->velFront = RESET;
         break;

      case 4:
         variables->velSide = -AUTO_SPEED;
         variables->velFront = RESET;
         break;

      default:
         variables->velFront = RESET;
         variables->velSide = RESET;
         break;
   }
}

void moveAbs(struct ExploreVariable *variables, struct Point point) {
   setHoverAbsolutePoint(&variables->setpoint, point, variables->altitude,
                         RESET);
   commanderSetSetpoint(&variables->setpoint, 3);
}

void setHoverAbsolutePoint(setpoint_t *setpoint, struct Point point, float z,
                           float yawrate) {
   setpoint->mode.z = modeAbs;
   setpoint->position.z = z;
   setpoint->mode.yaw = modeVelocity;
   setpoint->attitudeRate.yaw = yawrate;
   setpoint->mode.x = modeAbs;
   setpoint->mode.y = modeAbs;
   setpoint->position.x = point.position[0];
   setpoint->position.y = point.position[1];
   setpoint->velocity_body = true;
}

void moveColision(struct ExploreVariable *variables, float velFront,
                  float velSide) {
   setSpeedPoint(&variables->setpoint, velFront, velSide, variables->altitude,
                 RESET);
   commanderSetSetpoint(&variables->setpoint, 3);
}

void explore(struct ExploreVariable *variables) {
   vTaskDelay(M2T(10));
   uint8_t positioningInit = paramGetUint(variables->idPositioningDeck);
   uint8_t multirangerInit = paramGetUint(variables->idMultiranger);
   uint16_t up = logGetUint(variables->idUp);
   if (variables->state == unlocked && updateBatteryLvl(variables) == RESET) {
      updateMap(variables);
      float velSide = detectSideColision(variables);
      float velFront = detectFrontColision(variables);
      setDroneAltitude(variables, up);

      if (logGetUint(variables->idFront) < radius ||
          logGetUint(variables->idBack) < radius ||
          logGetUint(variables->idRight) < radius ||
          logGetUint(variables->idLeft) < radius) {
         moveColision(variables, velFront, velSide);
         variables->moveAutomatic_index = RESET;
      } else {
         if (variables->mode == MANUAL_MODE) {
            move(variables);
         } else {
            moveAutomatic(variables);
         }
      }
   } else {
      if (up < unlockThLow && variables->state == idle && up > 0.001f) {
         variables->state = lowUnlock;
      }

      if (up > unlockThHigh && variables->state == lowUnlock &&
          positioningInit && multirangerInit) {
         variables->state = unlocked;
      }
   }
}
