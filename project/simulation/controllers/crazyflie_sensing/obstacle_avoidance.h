#ifndef OBSTACLE_AVOIDANCE_H_
#define OBSTACLE_AVOIDANCE_H_

#include <argos3/core/utility/math/vector3.h>

using namespace argos;

CVector3 adjustTranslation(const CVector3 &translation, const double readings[4],
                      double minDistance, double tooFarValue);

#endif  // OBSTACLE_AVOIDANCE_H_
