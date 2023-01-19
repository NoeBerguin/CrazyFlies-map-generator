#ifndef VEC3_UTILS_H_
#define VEC3_UTILS_H_

#include <argos3/core/utility/math/vector3.h>

struct Vec {
   double x;
   double y;
   double z;
};

using namespace argos;

inline CVector3 toCVec3(struct Vec vec) {
   return CVector3(vec.x, vec.y, vec.z);
}

inline struct Vec toVec(CVector3 cvec) {
   return {cvec.GetX(), cvec.GetY(), cvec.GetZ()};
}

#endif // VEC3_UTILS_H_
