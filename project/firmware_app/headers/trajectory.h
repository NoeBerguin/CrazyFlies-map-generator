#include "FreeRTOS.h"
#include "app.h"
#include "commander.h"
#include "log.h"
#include "param.h"
#include "star.h"
#include "task.h"

#ifndef TRAJECTORY_H
#define TRAJECTORY_H

/********************************************************************************
  @brief: Defines the low level state machine.
        * Used directly in the random walk algorithm.
* *******************************************************************************/
typedef enum { idle, lowUnlock, unlocked, stopping, landed } LowLevelState;

/********************************************************************************
  @brief: Represents the different Modes of control.
* *******************************************************************************/
typedef enum {
   MANUAL_MODE = 40,
   AUTOMATIC_MODE = 41,
} Mode;

/********************************************************************************
  @brief: Represents a list of points the drone can go to.
        * current_target_index : represents where we are in the trajectory
* *******************************************************************************/
struct Trajectory {
   struct ListPoint list;
   int current_target_index;
   int state;
};

/********************************************************************************
  @brief: Sets the drone to specific altitude.
  @param: struct Trajectory
  @return: void
* *******************************************************************************/
void updateTrajectory(struct Trajectory *trajectory);

#endif