#include "returnAlgo.h"
#include "stateController.h"

void returnToBase(struct ExploreVariable *variables) {
   if (variables->trajectory.state == RESET) {
      if (variables->trajectory.list.size == RESET) {
         generateNewTrajectory(variables);
      } else {
         *variables->GLOBAL_STATE = STATE_STOP;
         variables->trajectory.list.size = RESET;
      }
   } else {
      updateTrajectory(&variables->trajectory);
      struct Point target =
          variables->trajectory.list
              .data[variables->trajectory.current_target_index];
      float velSide = detectSideColision(variables);
      float velFront = detectFrontColision(variables);
      if (logGetUint(variables->idFront) < RADIUS ||
          logGetUint(variables->idBack) < RADIUS ||
          logGetUint(variables->idRight) < RADIUS ||
          logGetUint(variables->idLeft) < RADIUS) {
         moveColision(variables, velFront, velSide);
      } else {
         moveAbs(variables, target);
      }
   }
}

void generateNewTrajectory(struct ExploreVariable *variables) {
   struct Point start = {
       {(logGetFloat(logGetVarId("kalman", "stateX")) * FACTOR_100),
        (logGetFloat(logGetVarId("kalman", "stateY")) * FACTOR_100)}};
   struct Point end = {{RESET, RESET}};
   struct ListPoint listOutput = aStar(&variables->map, start, end);
   struct Trajectory new_trajectory = {listOutput, 2, 1};
   if (variables->trajectory.list.size > RESET) {
      free(variables->trajectory.list.data);
   }
   variables->trajectory = new_trajectory;
}
