import json
import struct
from cflib import crtp

from .command import Command
from .crazyflie_drone import CrazyflieDrone

class CrazyflieHandler:
    def __init__(self):
        self.crazyflies_found = {}
        self.crazyflies_connected = {}
        crtp.init_drivers()

    def handle_command(self, command: int, arg: str) -> "int|list|None":
        if command == Command.SCAN.value:
            return self.scan_interfaces()
        elif command == Command.CONNECT.value:
            return self.connect(arg)
        else:
            if arg in self.crazyflies_connected:
                data = struct.pack("I", command)
                self.crazyflies_connected[arg].send_data(data)

    def send_command(self, command: int) -> None:
        data = struct.pack("I", command)
        self.crazyflies_connected["radio://0/90/250K/E7E7E7E7E8"].send_data(data)

    def release(self) -> None:
        for cf_connected in self.crazyflies_connected.values():
            cf_connected.release()

        self.crazyflies_connected = {}

    def scan_interfaces(self) -> list:
        drones_found = []
        drones_found = crtp.scan_interfaces(0xE7E7E7E7E8)

        uris = []
        uris = [x[0] for x in drones_found]
        drones_found = []

        json_list = []
        self.crazyflies_found = {}
        for id, uri in enumerate(uris):
            self.crazyflies_found[uri] = CrazyflieDrone(id, uri)
            data = {"id": id, "uri": uri}
            json_dump = json.dumps(data)
            json_list.append(json_dump)
        return json_list

    def connect(self, uri: str) -> int:
        cf_connected = self.crazyflies_connected
        if uri in cf_connected and cf_connected[uri].is_connected():
            return 1
        return self.crazyflies_found[uri].connect(
            self.connected_callback, self.connection_lost_callback
        )

    def connected_callback(self, uri) -> None:
        self.crazyflies_connected[uri] = self.crazyflies_found[uri]

    def connection_lost_callback(self, uri: str, msg: str) -> None:
        # """Callback when disconnected after a connection has been made (i.e
        # Crazyflie moves out of range)"""
        if uri in self.crazyflies_connected:
            self.crazyflies_connected[uri].release()
            self.crazyflies_connected.pop(uri, None)

    def get_state(self) -> list:
        drone_states = []
        for drone in self.crazyflies_connected.values():
            drone_states.append(drone.get_state())
        return drone_states
