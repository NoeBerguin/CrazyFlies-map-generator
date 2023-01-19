APP=1
APP_STACKSIZE=300

VPATH += src/
INCLUDES += -I./headers
PROJ_OBJ += appMain.o stateController.o variables.o trajectory.o explore.o communication.o star.o returnAlgo.o droneController.o

CRAZYFLIE_BASE = ../../../crazyflie-firmware
include $(CRAZYFLIE_BASE)/Makefile
