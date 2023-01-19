#include "explore.h"
#include "returnAlgo.h"

#define MAX_SPEED 0.5f
#define MINIMUM_BATTERY_LVL 30.0f
#define MAXIMUM_BATTERY_LVL 100.0f
#define RESET 0.0f

/********************************************************************************
  @brief: Represents all the HIGH level states.
* *******************************************************************************/
typedef enum {
   STATE_IDLE = 0,
   STATE_RETURN_TO_BASE = 3,
   STATE_IDENTIFY = 4,
   STATE_START = 5,
   STATE_STOP = 6,
   STATE_CRASHED = 8,
   STATE_LOW_BATTERY = 12
} State;

/********************************************************************************
  @brief: Allows to switch between high level states.
  @param: State and struct ExploreVariable
  @return: void
* *******************************************************************************/
void switchHighLevelState(State state, struct ExploreVariable *variables);

/********************************************************************************
  @brief: Convers a command from the user into a state.
  @param: int command, struct ExploreVariable and int * state.
  @return: void
* *******************************************************************************/
void updateHighLevelState(int command, struct ExploreVariable *variables,
                          int *state);

/********************************************************************************
  @brief: Sets the drone to specified command.
  @param: Command and struct ExploreVariable.
  @return: void
* *******************************************************************************/
void useCommand(Command command, struct ExploreVariable *variables);

/********************************************************************************
  @brief: Change the control mode : AUTO or MANUAL.
        * Manual : PS4 controller.
        * Automatic : Uses random walk.
  @param: Mode and struct ExploreVariable.
  @return: void
* *******************************************************************************/
void changeMode(Mode mode, struct ExploreVariable *variables);

/********************************************************************************
  @brief: Lands the drone.
  @param: struct ExploreVariable.
  @return: void
* *******************************************************************************/
void land(struct ExploreVariable *variables);

/********************************************************************************
  @brief: Identifies the drone by turning the M1 LED to green for 10 seconds.
  @param: none.
  @return: void
* *******************************************************************************/

void identify();

/********************************************************************************
  @brief: Contains the routine for the state : START.
  @param: struct ExploreVariable.
  @return: void
* *******************************************************************************/
void start(struct ExploreVariable *variables);