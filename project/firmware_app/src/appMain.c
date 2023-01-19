#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "communication.h"
#include "droneController.h"
#include "stateController.h"
#include "crtp_commander_high_level.h"
#include "debug.h"

int GLOBAL_STATE = STATE_IDLE;
struct ExploreVariable variables;

void appMain() {
   initialiseExploreVariables(&variables, &GLOBAL_STATE);
   while (true) {
      int package = lookForPackage();
      if (package != NO_PACKET) {
         updateHighLevelState(package, &variables, &GLOBAL_STATE);
      } else {
         switchHighLevelState(GLOBAL_STATE, &variables);
      }
      detectDroneCrash(&variables);
   }
}
LOG_GROUP_START(drone)
LOG_ADD(LOG_FLOAT, percentage, &variables.battery_lvl)
LOG_ADD(LOG_INT8, currentstate, &GLOBAL_STATE)
LOG_GROUP_STOP(drone)
