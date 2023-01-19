#include "debug.h"
#include "led.h"
#include "motors.h"
#include "pm.h"
#include "sound.h"
#include "stateController.h"
#include "supervisor.h"

void stopEngines() {
   // turns off motors, false = no init sound, frequency.
   motorsBeep(MOTOR_M1, false, RESET, RESET);
   motorsBeep(MOTOR_M2, false, RESET, RESET);
   motorsBeep(MOTOR_M3, false, RESET, RESET);
   motorsBeep(MOTOR_M4, false, RESET, RESET);
}

void controlM1LedGreen(bool on) {
   if (on) {
      ledSet(LED_GREEN_R, 1);
   } else {
      ledSet(LED_GREEN_R, 0);
   }
}

void controlM1LedRed(bool on) {
   if (on) {
      ledSet(LED_RED_R, 1);
   } else {
      ledSet(LED_RED_R, 0);
   }
}

void controlM1LedOrange() {
   controlM1LedOrange(true);
   controlM1LedOrange(true);
}

void detectDroneCrash(struct ExploreVariable *variables) {
   if (supervisorIsTumbled()) {
      DEBUG_PRINT("Crashed!\n");
      *variables->GLOBAL_STATE = STATE_CRASHED;
   }
}

float batteryExtremeCaseNormalisation(float battery_lvl) {
   if (battery_lvl > MAXIMUM_BATTERY_LVL) {
      return MAXIMUM_BATTERY_LVL;
   } else if (battery_lvl < RESET) {
      return RESET;
   }
   return battery_lvl;
}

int updateBatteryLvl(struct ExploreVariable *variables) {
   variables->battery_average +=
       ((logGetFloat(logGetVarId("pm", "vbat")) - VBAT_MIN) /
        (VBAT_MAX - VBAT_MIN)) *
       MAXIMUM_BATTERY_LVL;
   variables->battery_check_index += 1;
   if (variables->battery_check_index > MAX_BATTERY_CHECK_INDEX) {
      variables->battery_lvl = batteryExtremeCaseNormalisation(
          (float)(variables->battery_average / MAX_BATTERY_CHECK_INDEX));
      DEBUG_PRINT("battery: %f \n", (double)variables->battery_lvl);
      variables->battery_check_index = RESET;
      if ((double)variables->battery_lvl <= (double)MINIMUM_BATTERY_LVL) {
         DEBUG_PRINT("battery: %f  returning to base\n",
                     (double)variables->battery_lvl);
         *variables->GLOBAL_STATE = STATE_RETURN_TO_BASE;
         return 1;
      } else {
         *variables->GLOBAL_STATE = STATE_START;
      }
      variables->battery_average = RESET;
   }
   return 0;
}

int verifyBattery(struct ExploreVariable *variables) {
   if (variables->battery_lock) {
      for (int count = RESET; count < MAX_BATTERY_CHECK_INDEX; ++count) {
         variables->battery_average += variables->battery_average;
         vTaskDelay(M2T(10));
      }
      variables->battery_lvl = batteryExtremeCaseNormalisation(
          (float)(variables->battery_average / MAX_BATTERY_CHECK_INDEX));
      DEBUG_PRINT("battery to block start: %f \n",
                  (double)variables->battery_lvl);
      if (variables->battery_lvl <= MINIMUM_BATTERY_LVL) {
         variables->battery_lock = RESET;
         return RESET;
      }
      variables->battery_lock = RESET;
      variables->battery_average = RESET;
   }
   return 1;
}
