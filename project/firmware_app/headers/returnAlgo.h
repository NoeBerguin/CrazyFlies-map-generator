#include <stdlib.h>

#include "explore.h"

#define RADIUS 300
#define MAX_COLISION_INDEX 1000
#define FACTOR_100 100

/***********************************************************************
  @brief: Generates a new trajectory for the drone to go to point (0,0) origin.
  @param: struct ExploreVariable
  @return: void
* ********************************************************************/
void generateNewTrajectory(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Brings the drone back to its original position by following a
          trajectory.
  @param: struct ExploreVariable
  @return: void
* ********************************************************************/
void returnToBase(struct ExploreVariable *variables);