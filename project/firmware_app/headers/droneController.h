#include "variables.h"

/***********************************************************************
  @brief: Turns the M1 LED to GREEN.
  @param: Bool on. Allows to turn on of off the LED.
  @return: void
* ********************************************************************/
void controlM1LedGreen(bool on);

/***********************************************************************
  @brief: Turns the M1 LED to RED.
  @param: Bool on. Allows to turn on of off the LED.
  @return: void
* ********************************************************************/
void controlM1LedRed(bool on);

/***********************************************************************
  @brief: Opens the M1 LED to orange.
  @param: none.
  @return: void.
* ********************************************************************/
void controlM1LedOrange();

/***********************************************************************
  @brief: Stops the 4 motors of a crazyflie drone.
  @param: none.
  @return: void
**********************************************************************/
void stopEngines();

/***********************************************************************
  @brief: Detects if the drone has crashed and sets the state to crashed.
  @param: Struct ExploreVariable.
  @return: void
* ********************************************************************/
void detectDroneCrash(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Calculates the battery level.
  @param: Struct ExploreVariable.
  @return: 1 if battery is less than 30%. In any other case returns 0.
* ********************************************************************/
int updateBatteryLvl(struct ExploreVariable *variables);

/***********************************************************************
  @brief: Verifies the battery level and the state. If the state is START
   and the battery is less than 30%, the drone will not take off.
  @param: Struct ExploreVariable.
  @return: 1 if drone can take off. 0 if drone cannot take off.
* ********************************************************************/
int verifyBattery(struct ExploreVariable *variables);

float batteryExtremeCaseNormalisation(float battery_lvl);