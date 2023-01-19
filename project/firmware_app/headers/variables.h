#ifndef VARIABLES_H
#define VARIABLES_H

#include "trajectory.h"

#define MAX_INDEX 100
#define MAX_BATTERY_CHECK_INDEX 150
#define VBAT_MIN 3.0f
#define VBAT_MAX 4.2f

/***********************************************************************
 * ** This struct contain all the command that user can send with PS4
 * ** controller.
 * ********************************************************************/
typedef enum {
   UP = 20,
   DOWN = 21,
   RIGHT = 22,
   LEFT = 23,
   UP_RIGHT = 24,
   UP_LEFT = 25,
   DOWN_RIGHT = 26,
   DOWN_LEFT = 27,
   CENTER = 28,
   DEBUG_MAP = 30,
} Command;

/***********************************************************************
 * ** This struct contain all the necessary variables to controll the
 * ** drone.
 * ********************************************************************/
struct ExploreVariable {
   setpoint_t setpoint;
   logVarId_t idUp;     // up sensor
   logVarId_t idLeft;   // left sensor
   logVarId_t idRight;  // right sensor
   logVarId_t idFront;  // front sensor
   logVarId_t idBack;   // back sensor
   paramVarId_t idPositioningDeck;
   paramVarId_t idMultiranger;
   float factor;
   float velFront;
   float velSide;
   float altitude;
   LowLevelState state;
   struct Map map;
   struct Trajectory trajectory;  // current trajectory to go back to (0, 0)
   Mode mode;                     // control mode
   int *GLOBAL_STATE;             // HIGH LEVEL state
   int moveAutomatic_index;       // automatic move current index
   float battery_lvl;
   int landing_lock;
   int battery_check_index;
   int battery_lock;
   float battery_average;
};

/********************************************************************************
  @brief: Reset value of landing_lock and battery_lock.
  @param: struct ExploreVariable.
  @return: void
* *******************************************************************************/
void resetLandingLock(struct ExploreVariable *variables);

#endif
