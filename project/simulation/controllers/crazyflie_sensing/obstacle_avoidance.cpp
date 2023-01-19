#include "obstacle_avoidance.h"

#include "sensors_info.h"

static double safeAxisTranslation(double axisTranslation,
                                  double negativeReading,
                                  double positiveReading, double minDistance,
                                  double tooFarValue) {
   int negativeObject = negativeReading != tooFarValue;
   int positiveObject = positiveReading != tooFarValue;

   double positiveBoundary = (positiveReading - minDistance);
   double negativeBoundary = -(negativeReading - minDistance);

   if (positiveObject) {
      axisTranslation = axisTranslation > positiveBoundary ? positiveBoundary
                                                           : axisTranslation;
   }

   if (negativeObject) {
      axisTranslation = axisTranslation < negativeBoundary ? negativeBoundary
                                                           : axisTranslation;
   }

   if (negativeObject && positiveObject &&
       (negativeReading + positiveReading < 2 * minDistance)) {
      axisTranslation =
          (((negativeReading + positiveReading) / 2) - negativeReading);
   }

   return axisTranslation;
}

CVector3 adjustTranslation(const CVector3 &translation,
                           const double readings[MAX_DISTANCE_SENSORS],
                           double minDistance, double tooFarValue) {
   CVector3 safeTranslation = translation;

   safeTranslation.SetX(safeAxisTranslation(translation.GetX(), readings[X_NEGATIVE],
                                            readings[X_POSITIVE], minDistance,
                                            tooFarValue));
   safeTranslation.SetY(safeAxisTranslation(translation.GetY(), readings[Y_NEGATIVE],
                                            readings[Y_POSITIVE], minDistance,
                                            tooFarValue));

   return safeTranslation;
}
