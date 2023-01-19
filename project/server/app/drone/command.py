from enum import Enum


class Command(Enum):
    START = 0
    STOP = 1
    SCAN = 2
    returnToBase =3
    IDENTIFY = 4
    IDLE = 5
    NEW_MISSION = 7
    MISSION_HISTORY = 8
    DELETE_MISSION = 9
    MODE = 10
    CONNECT = 11

    UP = 20
    DOWN = 21
    RIGHT = 22
    LEFT = 23
    UP_RIGHT = 24
    UP_LEFT = 25
    DOWN_RIGHT = 26
    DOWN_LEFT = 27
    CENTER = 28
