#ifndef CRAZYFLIE_TRAVELING_H_
#define CRAZYFLIE_TRAVELING_H_

#include <argos3/core/control_interface/ci_controller.h>
#include <argos3/core/utility/math/rng.h>
#include <argos3/core/utility/math/vector3.h>
#include <argos3/plugins/robots/generic/control_interface/ci_positioning_sensor.h>
#include <argos3/plugins/robots/generic/control_interface/ci_quadrotor_position_actuator.h>

#include "sensors_info.h"

const float MIN_WALL_DISTANCE = 0.2f;
const float CLOSE_TO_TARGET_DISTANCE = 0.025f;
const float TOO_FAR_DISTANCE_READING = -2.0f;
const float MIN_ALTITUDE = 0.25f;
const float MAX_ALTITUDE = 0.5f;
const float ALTITUDE_STEP = 0.12f;

using namespace argos;

class CrazyflieTraveling {
public:
   CrazyflieTraveling(CCI_QuadRotorPositionActuator* _m_pcPropellers,
                      CRandom::CRNG* _m_pcRNG, int _id);

   void TravelSafe(const CVector3& translation, const CVector3& position,
                   const double distances[MAX_DISTANCE_SENSORS], double speed);

   bool Hover();

   void Explore();

   bool Land();

   bool ReturnToBase();

   CVector3 m_cInitialPosition;
   CVector3 m_targetPosition;
   struct DroneInfo m_cInfo;

private:
   CCI_QuadRotorPositionActuator* m_pcPropellers;
   CRandom::CRNG* m_pcRNG;
   CCI_PositioningSensor* m_pcPos;
   float altitude;
};

#endif  // CRAZYFLIE_TRAVELING_H_
