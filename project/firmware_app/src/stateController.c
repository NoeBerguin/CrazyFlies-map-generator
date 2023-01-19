#include <stdlib.h>

#include "trajectory.h"
#include "debug.h"
#include "droneController.h"
#include "stateController.h"


void switchHighLevelState(State state, struct ExploreVariable *variables) {
   switch (state) {
      case STATE_IDLE:
         variables->battery_lvl =
             logGetFloat(logGetVarId("pm", "batteryLevel"));
         break;

      case STATE_IDENTIFY:
         variables->battery_lvl =
             logGetFloat(logGetVarId("pm", "batteryLevel"));
         identify();
         break;

      case STATE_START:
         start(variables);
         break;

      case STATE_STOP:
         variables->battery_lvl =
             logGetFloat(logGetVarId("pm", "batteryLevel"));
         land(variables);
         break;

      case STATE_RETURN_TO_BASE:
         returnToBase(variables);
         break;

      case STATE_LOW_BATTERY:
         controlM1LedOrange();
         break;

      default:
         break;
   }
}

void updateHighLevelState(int command, struct ExploreVariable *variables,
                          int *state) {
   if (command < 10) {
      *state = command;
      DEBUG_PRINT("state: %d \n", *state);
      switchHighLevelState(command, variables);
   } else if (command >= MANUAL_MODE) {
      changeMode(command, variables);
   } else {
      useCommand(command, variables);
   }
}

void changeMode(Mode mode, struct ExploreVariable *variables) {
   variables->mode = mode;
   DEBUG_PRINT("mode: %d \n", variables->mode);
}

void useCommand(Command command, struct ExploreVariable *variables) {
   switch (command) {
      case UP:
         variables->velFront = MAX_SPEED;
         break;

      case DOWN:
         variables->velFront = -MAX_SPEED;
         break;

      case RIGHT:
         variables->velSide = -MAX_SPEED;
         break;

      case LEFT:
         variables->velSide = MAX_SPEED;
         break;

      case UP_RIGHT:
         variables->velSide = -MAX_SPEED;
         break;

      case UP_LEFT:
         variables->velFront = MAX_SPEED;
         variables->velSide = MAX_SPEED;
         break;

      case DOWN_RIGHT:
         variables->velFront = -MAX_SPEED;
         variables->velSide = -MAX_SPEED;
         break;

      case DOWN_LEFT:
         variables->velFront = -MAX_SPEED;
         variables->velSide = MAX_SPEED;
         break;

      case CENTER:
         variables->velFront = RESET;
         variables->velSide = RESET;
         break;

      case DEBUG_MAP:
         variables->velFront = RESET;
         variables->velSide = RESET;
         break;

      default:
         variables->velFront = RESET;
         variables->velSide = RESET;
         break;
   }
}

void land(struct ExploreVariable *variables) {
   if (variables->landing_lock == 1) {
      vTaskDelay(M2T(10));
      setSpeedPoint(&variables->setpoint, RESET, RESET, RESET, RESET);
      commanderSetSetpoint(&variables->setpoint, 3);
      vTaskDelay(M2T(1000));
      variables->landing_lock = RESET;
   }
}

void identify() {
   controlM1LedGreen(true);
   vTaskDelay(M2T(1000));  // 10 sec
   controlM1LedGreen(false);
   vTaskDelay(M2T(1000));
}

void start(struct ExploreVariable *variables) {
   variables->state = unlocked;
   resetLandingLock(variables);
   if (!verifyBattery(variables)) {
      *variables->GLOBAL_STATE = STATE_LOW_BATTERY;
   } else {
      explore(variables);
   }
}
