import time
import math
from typing import Callable
from cflib.crazyflie import Crazyflie
from cflib.crazyflie.log import LogConfig
from cflib.utils import uri_helper

from .drone import Drone


class CrazyflieDrone(Drone):
    FACTOR = 100
    map = ""

    def __init__(self, id: int, uri: str):
        self.iteration = 0
        self.uri = uri_helper.uri_from_env(default=uri)
        self.old_x = None
        self.old_y = None
        self.new_x = None
        self.new_y = None
        super().__init__(id)

    def connect(
        self,
        connected_callback: Callable[[str], None],
        connection_lost_callback: Callable[[str, str], None],
    ) -> int:
        self.cf = Crazyflie(rw_cache="./cache")

        self.cf.connected.add_callback(connected_callback)
        self.cf.connected.add_callback(self.connected_callback)
        self.cf.connection_lost.add_callback(connection_lost_callback)
        self.cf.console.receivedChar.add_callback(self._app_packet_debug)

        self.cf.open_link(self.uri)
        i = 0
        while self.is_connected == False:
            time.sleep(1)
            if i > 15:
                return 0
            i += 1
        return 1

    def connected_callback(self, uri: str) -> None:
        self.is_connected = True
        if self.cf == None:
            return

        # """ This callback is called form the Crazyflie API when a Crazyflie
        # has been connected and the TOCs have been downloaded."""

        # The definition of the logconfig can be made before connecting
        self.lg_pos = LogConfig(name="Readings", period_in_ms=100)

        self.lg_pos.add_variable("kalman.stateX", "float")
        self.lg_pos.add_variable("kalman.stateY", "float")

        self.lg_pos.add_variable("range.back", "float")
        self.lg_pos.add_variable("range.front", "float")
        self.lg_pos.add_variable("range.left", "float")
        self.lg_pos.add_variable("range.right", "float")

        self.lg_yaw = LogConfig(name="Yaw", period_in_ms=100)
        self.lg_yaw.add_variable("stabilizer.yaw", "float")
        self.lg_yaw.add_variable("drone.currentstate", "uint8_t")
        self.lg_yaw.add_variable("drone.percentage", "float")

        # Adding the configuration cannot be done until a Crazyflie is
        # connected, since we need to check that the variables we
        # would like to log are in the TOC.
        try:
            self.cf.log.add_config(self.lg_pos)
            self.cf.log.add_config(self.lg_yaw)

            # This callback will receive the data
            self.lg_pos.data_received_cb.add_callback(self.log_data_pos)

            # This callback will be called on errors
            self.lg_pos.error_cb.add_callback(self.log_error)

            # This callback will receive the data
            self.lg_yaw.data_received_cb.add_callback(self.log_data_yaw)
            # This callback will be called on errors
            self.lg_yaw.error_cb.add_callback(self.log_error)

            # Start the logging
            self.lg_pos.start()
            # Start the logging
            self.lg_yaw.start()

        except KeyError as e:
            print(
                "Could not start log configuration,"
                "{} not found in TOC".format(str(e))
            )
        except AttributeError:
            print("Could not add Readings log config, bad configuration.")

    def log_error(self, logconf: LogConfig, msg: str) -> None:
        """Callback from the log API when an error occurs"""
        print("Error when logging %s: %s" % (logconf.name, msg))

    def log_data_pos(self, timestamp: str, data: dict, logconf: LogConfig) -> None:
        """Callback from a the log API when data arrives"""
        del timestamp, logconf
        self.old_x = self.new_x
        self.old_y = self.new_y

        if self.new_x == None and self.new_y == None:
            self.x = self.old_x = int(data["kalman.stateX"] * self.FACTOR)
            self.y = self.old_y = -int(data["kalman.stateY"] * self.FACTOR)

        self.new_x = int(data["kalman.stateX"] * self.FACTOR)
        self.new_y = -int(data["kalman.stateY"] * self.FACTOR)

        # relative position of captors in canvas referential
        self.front = int(data["range.front"] / 10)
        self.back = int(data["range.back"] / 10)
        self.right = int(data["range.right"] / 10)
        self.left = int(data["range.left"] / 10)

        self.rotate_readings()

    def log_data_yaw(self, timestamp: str, data, logconf: LogConfig) -> None:
        del timestamp, logconf
        self.old_yaw = self.yaw
        if self.yaw is None:
            self.old_yaw = data["stabilizer.yaw"]
        self.yaw = 0
        self.state = data["drone.currentstate"]
        self.battery = data["drone.percentage"] / 100

    def release(self) -> None:
        if self.cf != None:
            self.cf.close_link()

    def is_connected(self) -> bool:
        if self.cf != None:
            return self.cf.is_connected()
        return False

    def send_data(self, data: bytes) -> None:
        if self.cf != None and self.is_connected:
            self.cf.appchannel.send_packet(data)

    # for DEBUG
    def _app_packet_debug(self, debugdata: str) -> None:
        print("received debug")
        print(debugdata + "\n")
        # self.map += debugdata

    def rotate_point(self, x: float, y: float) -> "tuple[float, float]":
        angle = math.radians(self.yaw)
        rotated_x = x * math.cos(angle) + y * math.sin(angle)
        rotated_y = -x * math.sin(angle) + y * math.cos(angle)
        return rotated_x, rotated_y

    def rotate_readings(self) -> None:
        dx = self.new_x - self.old_x
        dy = self.new_y - self.old_y

        if self.yaw is not None:
            dx, dy = self.rotate_point(dx, dy)

        self.x = self.x + dx
        self.y = self.y + dy
