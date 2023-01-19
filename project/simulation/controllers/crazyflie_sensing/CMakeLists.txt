FILE(GLOB SOURCES *.h *.cpp *.c)
add_library(crazyflie_sensing SHARED ${SOURCES})
target_link_libraries(crazyflie_sensing
  argos3core_simulator
  argos3plugin_simulator_crazyflie
  argos3plugin_simulator_genericrobot)
