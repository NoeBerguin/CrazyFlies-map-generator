#include "trajectory.h"

void updateTrajectory(struct Trajectory *trajectory) {
   double x = logGetFloat(logGetVarId("kalman", "stateX"));
   double y = logGetFloat(logGetVarId("kalman", "stateY"));

   double vx =
       trajectory->list.data[trajectory->current_target_index].position[0];
   double vy =
       trajectory->list.data[trajectory->current_target_index].position[1];
   double round = 0.10;

   if (trajectory->current_target_index >= trajectory->list.size) {
      trajectory->state = 0;
      trajectory->current_target_index = 0;
   } else {
      if ((x >= vx - round && x <= vx + round) &&
          (y >= vy - round && y <= vy + round)) {
         trajectory->current_target_index += 1;
      }
   }
}
