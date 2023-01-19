#ifndef EXPLORE_H
#define EXPLORE_H

#include "commander.h"
#include "variables.h"

#define LOCK_ON 1
#define LOCK_OFF 0
#define MAX(a, b) ((a > b) ? a : b)
#define MIN(a, b) ((a < b) ? a : b)
#define AUTO_SPEED 0.25f

/***********************************************************************
  @brief: Moves the drone
  @param: Takes a struct : ExploreVariable.
  @return: void
* ********************************************************************/
void move(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Moves the drones awats from an obstacles when one is detected.
  @param: Struct ExploreVariable, float velFront and float velSide.
  @return: void
* ********************************************************************/
void moveColision(struct ExploreVariable *variables, float velFront,
                  float velSide);

/***********************************************************************
  @brief: Moves the drone to a specific abosolute point.
  @param: Struct ExploreVariable and Struct Point.
  @return: void
* ********************************************************************/
void moveAbs(struct ExploreVariable *variables, struct Point point);

/***********************************************************************
  @brief: Sets the drone to a specific absolute point.
  @param: Struct Setpoint_t, Struct Point and 2 floats.
  @return: void
* ********************************************************************/
void setHoverAbsolutePoint(setpoint_t *setpoint, struct Point point, float z,
                           float yawrate);

/***********************************************************************
  @brief: Sets the speed of the drone.
  @param: Struct Setpoint_t, 2 floats representing speed in x,y, and yawrate.
  @return: void
* ********************************************************************/
void setSpeedPoint(setpoint_t *setpoint, float vx, float vy, float z,
                   float yawrate);

/***********************************************************************
  @brief: Updates the current map on the drone.
          Drone set '0' to his positions and '1' to the rest.
  @param: Struct ExploreVariable.
  @return: void
* ********************************************************************/
void updateMap(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Move the drone to a random direction
  @param: struct ExploreVariable
  @return: void
* ********************************************************************/
void moveAutomatic(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Chooses a random direction for the drone.
  @param: struct ExploreVariable
  @return: void
* ********************************************************************/
void randomDirection(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Detects if there is a collision from the right or left of the drone.
  @param: struct ExploreVariable
  @return: float
* ********************************************************************/
float detectSideColision(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Detects if there is a collision in front or behind the drone.
  @param: struct ExploreVariable
  @return: float
* ********************************************************************/
float detectFrontColision(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Sets the drone to specific altitude.
  @param: struct ExploreVariable and integer up.
  @return: void
* ********************************************************************/
void setDroneAltitude(struct ExploreVariable *variables, uint16_t up);

/***********************************************************************
  @brief: Initialises the variables that are needed for each itaration.
  @param: struct ExploreVariable and integer Global_state.
  @return: void
* ********************************************************************/
void initialiseExploreVariables(struct ExploreVariable *variables,
                                int *GLOBAL_STATE);

/***********************************************************************
  @brief: Explores the sourrounding area of the drone. (Using a random walk
          algorithm).
  @param: struct ExploreVariable
  @return: void
* ********************************************************************/
void explore(struct ExploreVariable *variables);

#endif