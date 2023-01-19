#ifndef SENSORS_INFO_H_
#define SENSORS_INFO_H_

#include "vec3_utils.h"

enum Readings { X_NEGATIVE, X_POSITIVE, Y_POSITIVE, Y_NEGATIVE, MAX_DISTANCE_SENSORS };

struct DroneInfo {
   int state;
   struct Vec position;
   double readings[MAX_DISTANCE_SENSORS];
   double battery = 1;
};

#endif  // SENSORS_INFO_H_
