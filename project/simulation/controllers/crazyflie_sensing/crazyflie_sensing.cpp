/* Include the controller definition */
#include "crazyflie_sensing.h"

#include "crazyflie_traveling.h"
#include "obstacle_avoidance.h"
#include "sensors_info.h"
#include "socket.h"
#include "vec3_utils.h"

/* Function definitions for XML parsing */
#include <argos3/core/utility/configuration/argos_configuration.h>
/* 2D vector definition */
#include <argos3/core/utility/math/rng.h>
#include <argos3/core/utility/math/vector2.h>
/* Logging */
#include <argos3/core/utility/logging/argos_log.h>
#include <argos3/core/utility/math/vector3.h>

#include <cstddef>

static const float POSIION_TO_READINGS_FACTOR = 100.0f;
/****************************************/
/****************************************/

CCrazyflieSensing::CCrazyflieSensing()
    : m_pcDistance(NULL),
      m_pcPropellers(NULL),
      m_pcRABA(NULL),
      m_pcRABS(NULL),
      m_pcPos(NULL),
      m_pcBattery(NULL),
      m_pcRNG(NULL),
      crazyflieTraveller(NULL, NULL, 0),
      sockfd(-1) {}

/****************************************/
/****************************************/

void CCrazyflieSensing::Init(TConfigurationNode& t_node) {
   try {
      /*
       * Initialize sensors/actuators
       */
      m_pcDistance = GetSensor<CCI_CrazyflieDistanceScannerSensor>(
          "crazyflie_distance_scanner");
      m_pcPropellers =
          GetActuator<CCI_QuadRotorPositionActuator>("quadrotor_position");
      /* Get pointers to devices */
      m_pcRABA = GetActuator<CCI_RangeAndBearingActuator>("range_and_bearing");
      m_pcRABS = GetSensor<CCI_RangeAndBearingSensor>("range_and_bearing");
      try {
         m_pcPos = GetSensor<CCI_PositioningSensor>("positioning");
      } catch (CARGoSException& ex) {
      }
      try {
         m_pcBattery = GetSensor<CCI_BatterySensor>("battery");
      } catch (CARGoSException& ex) {
      }
   } catch (CARGoSException& ex) {
      THROW_ARGOSEXCEPTION_NESTED(
          "Error initializing the crazyflie sensing controller for robot \""
              << GetId() << "\"",
          ex);
   }
   /*
    * Initialize other stuff
    */
   /* Create a random number generator. We use the 'argos' category so
      that creation, reset, seeding and cleanup are managed by ARGoS. */
   m_pcRNG = CRandom::CreateRNG("argos");
   crazyflieTraveller =
       CrazyflieTraveling(m_pcPropellers, m_pcRNG, stoi(GetId()));
   command = INVALID_COMMAND;
   Reset();
}

/****************************************/
/****************************************/

void CCrazyflieSensing::ControlStep() {
   if (sockfd == -1) {
      sockfd = serversock::createConnection();
   }

   serversock::readCommand(sockfd, &command);
   UpdateInfo();
   serversock::sendInfo(crazyflieTraveller.m_cInfo, sockfd);

   if (crazyflieTraveller.m_cInfo.battery < 0.3 && command != STOP_COMMAND) {
      command = RETURN_TO_BASE_COMMAND;
   }

   switch (command) {
      case START_COMMAND: {
         command = crazyflieTraveller.Hover() ? START_COMMAND : EXPLORE_COMMAND;
         break;
      }
      case EXPLORE_COMMAND: {
         crazyflieTraveller.Explore();
         break;
      }
      case RETURN_TO_BASE_COMMAND: {
         command = crazyflieTraveller.ReturnToBase() ? RETURN_TO_BASE_COMMAND
                                                     : STOP_COMMAND;
         break;
      }
      case STOP_COMMAND: {
         crazyflieTraveller.Land();
         break;
      }
   }
}

/****************************************/
/****************************************/
void CCrazyflieSensing::UpdateInfo() {
   const CCI_BatterySensor::SReading& sBatRead = m_pcBattery->GetReading();
   CCI_CrazyflieDistanceScannerSensor::TReadingsMap sDistRead =
       m_pcDistance->GetReadingsMap();
   auto iterDistRead = sDistRead.begin();

   crazyflieTraveller.m_cInfo.readings[Y_NEGATIVE] = (iterDistRead++)->second;
   crazyflieTraveller.m_cInfo.readings[X_POSITIVE] = (iterDistRead++)->second;
   crazyflieTraveller.m_cInfo.readings[Y_POSITIVE] = (iterDistRead++)->second;
   crazyflieTraveller.m_cInfo.readings[X_NEGATIVE] = (iterDistRead)->second;

   for (int i = 0; i < MAX_DISTANCE_SENSORS; ++i) {
      crazyflieTraveller.m_cInfo.readings[i] /=
          crazyflieTraveller.m_cInfo.readings[i] == TOO_FAR_DISTANCE_READING
              ? 1
              : POSIION_TO_READINGS_FACTOR;
   }

   crazyflieTraveller.m_cInfo.position = toVec(m_pcPos->GetReading().Position);
   crazyflieTraveller.m_cInfo.state = command;
   crazyflieTraveller.m_cInfo.battery = sBatRead.AvailableCharge;
}

void CCrazyflieSensing::Reset() {
   crazyflieTraveller.m_cInitialPosition = m_pcPos->GetReading().Position;
}

/****************************************/
/****************************************/

/*
 * This statement notifies ARGoS of the existence of the controller.
 * It binds the class passed as first argument to the string passed as
 * second argument.
 * The string is then usable in the XML configuration file to refer to
 * this controller.
 * When ARGoS reads that string in the XML file, it knows which controller
 * class to instantiate.
 * See also the XML configuration files for an example of how this is used.
 */
REGISTER_CONTROLLER(CCrazyflieSensing, "crazyflie_sensing_controller")
