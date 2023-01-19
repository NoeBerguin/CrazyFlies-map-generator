#include "crazyflie_traveling.h"
#include <algorithm>

#include "obstacle_avoidance.h"
#include "vec3_utils.h"

static const float SPEED = 1.5f;

CrazyflieTraveling::CrazyflieTraveling(
    CCI_QuadRotorPositionActuator* _m_pcPropellers, CRandom::CRNG* _m_pcRNG, int _id) {
   m_pcPropellers = _m_pcPropellers;
   m_pcRNG = _m_pcRNG;
   altitude = std::min(MIN_ALTITUDE + ALTITUDE_STEP * _id, MAX_ALTITUDE);
}

void CrazyflieTraveling::TravelSafe(const CVector3& translation,
                                    const CVector3& position,
                                    const double distances[MAX_DISTANCE_SENSORS], double speed) {
   CVector3 safeTranslation;
   if ((m_targetPosition - position).Length() > CLOSE_TO_TARGET_DISTANCE) {
      safeTranslation = m_targetPosition - position;
      safeTranslation = adjustTranslation(safeTranslation, distances, MIN_WALL_DISTANCE,
                                          TOO_FAR_DISTANCE_READING);
   } else {
      safeTranslation = translation;
      if (translation.Length() > speed)
         safeTranslation = translation * speed / translation.Length();
      safeTranslation = adjustTranslation(safeTranslation, distances, MIN_WALL_DISTANCE,
                                          TOO_FAR_DISTANCE_READING);
   }

   m_targetPosition = position + safeTranslation;

   m_pcPropellers->SetRelativePosition(m_targetPosition - position);
}

void CrazyflieTraveling::Explore() {
   CVector3 translation;
   if (m_pcRNG->Bernoulli()) {
      if (m_pcRNG->Bernoulli())
         translation.Set(0, -1, 0);
      else
         translation.Set(1, 0, 0);
   } else {
      if (m_pcRNG->Bernoulli())
         translation.Set(-1, 0, 0);
      else
         translation.Set(0, 1, 0);
   }

   TravelSafe(translation, toCVec3(m_cInfo.position), m_cInfo.readings, SPEED);
}

bool CrazyflieTraveling::ReturnToBase() {
   m_targetPosition.SetZ(m_cInitialPosition.GetZ());
   CVector3 position = toCVec3(m_cInfo.position);

   if (Abs(position.GetZ()) < CLOSE_TO_TARGET_DISTANCE) return false;

   position.SetZ(m_cInitialPosition.GetZ());
   CVector3 translation = m_cInitialPosition - position;

   if (translation.Length() > CLOSE_TO_TARGET_DISTANCE) {
      TravelSafe(translation, position, m_cInfo.readings,
                 CLOSE_TO_TARGET_DISTANCE);
      return true;
   }

   return false;
}

bool CrazyflieTraveling::Hover() {
   CVector3 cPos = toCVec3(m_cInfo.position);
   if (Abs(cPos.GetZ() - altitude) < CLOSE_TO_TARGET_DISTANCE) {
      m_targetPosition = cPos;
      return false;
   } else {
      cPos.SetZ(altitude);
      m_pcPropellers->SetAbsolutePosition(cPos);
      return true;
   }
}

bool CrazyflieTraveling::Land() {
   CVector3 position = toCVec3(m_cInfo.position);

   if (Abs(position.GetZ()) < CLOSE_TO_TARGET_DISTANCE) return false;

   position.SetZ(0);
   m_pcPropellers->SetAbsolutePosition(position);

   return true;
}
