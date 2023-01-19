import ctypes
from enum import Enum
import socket
import struct
import threading

from .drone import Drone
from .command import Command


class InfosPositions(Enum):
    STATE = 0
    X = 1
    Y = 2
    Z = 3
    FRONT_DISTANCE = 4
    BACK_DISTANCE = 5
    RIGHT_DISTANCE = 6
    LEFT_DISTANCE = 7
    BATTERY = 8

class ArgosHandler:
    PORT = 5800
    HOST_IP = "0.0.0.0"

    def __init__(self):
        self.clients = []
        self.drones = []
        self.process = threading.Thread(target=self.run)
        self.process.start()

    def release(self) -> None:
        for conn in self.clients:
            conn.close()

        self.clients = []

    def handle_command(self, command: int, _) -> None:
        self.broadcast_data(struct.pack("I", 0))
        self.broadcast_data(struct.pack("I", command))

    def connect(self, conn: socket.socket, _) -> None:
        drone = Drone(len(self.drones))
        self.clients.append(conn)
        self.drones.append(drone)

        receiving = True
        while receiving:
            receiving = self.receive_info(conn, drone)

        conn.close()
        self.clients.remove(conn)
        self.drones.remove(drone)

    def receive_info(self, conn: socket.socket, drone: Drone) -> bool:
        try:
            data_size = ctypes.sizeof(ctypes.c_double) * 9
            data = conn.recv(data_size)
            info = struct.unpack("i 8d", data)
            self.update_info(drone, info)
        except Exception:
            return False
        return True

    def update_info(self, drone: Drone, info: tuple) -> None:
        drone.state = info[InfosPositions.STATE.value]
        drone.x = info[InfosPositions.X.value]
        drone.y = info[InfosPositions.Y.value]
        drone.z = info[InfosPositions.Z.value]
        drone.front = info[InfosPositions.FRONT_DISTANCE.value]
        drone.back = info[InfosPositions.BACK_DISTANCE.value]
        drone.right = info[InfosPositions.RIGHT_DISTANCE.value]
        drone.left = info[InfosPositions.LEFT_DISTANCE.value]
        drone.battery = info[InfosPositions.BATTERY.value]

    def run(self) -> None:
        address = (self.HOST_IP, self.PORT)
        s = socket.create_server(address, family=socket.AF_INET, reuse_port=True)
        s.listen()
        while True:
            threading.Thread(target=self.connect, args=(*s.accept(),)).start()

    def broadcast_data(self, data: bytes) -> None:
        for client in self.clients:
            client.sendall(data)

    def get_state(self) -> list:
        drone_states = []
        for drone in self.drones:
            drone_states.append(drone.get_state())
        return drone_states
