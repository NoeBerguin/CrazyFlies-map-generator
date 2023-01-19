import json
import unittest
from flask.globals import request

from flask import jsonify, request
from flask.wrappers import Request, Response
import cflib.crtp
from unittest import mock
from app.database import Database
from app.command_handler import CommandHandler
from app.drone.drone import Drone
from app.drone import Command
from app.drone import ArgosHandler
import app.requests
from app.drone.crazyflie_drone import CrazyflieDrone
from app.drone.crazyflie_handler import CrazyflieHandler
from app.drone.drone import Drone
from app import app
from app import requests
import struct


class TestStringMethods(unittest.TestCase):
    db = Database()
    commandHandler = CommandHandler()
    MODE_SIMULATION = 1
    MODE_PHYSIC = 0

    @mock.patch.object(ArgosHandler, "run")
    def setUp(self, mock):
        app.config["TESTING"] = True
        app.config["DEBUG"] = False
        self.app = app.test_client()
        self.assertEqual(app.debug, False)
        self.argos_handler = ArgosHandler()
        self.crazyflie_handler = CrazyflieHandler()
       

    def test_command(self):
        response = self.app.post("/command", data="1")
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_packet(self):
        response = self.app.post("/packet/", data="1")
        print(response)
        self.assertEqual(response.status_code, 200)

    def test_Drone_get_state(self):
        drone = Drone(1)
        result = json.dumps( {
                "id": 1,
                "state": None,
                "x": None,
                "y": None,
                "z": None,
                "front": None,
                "back": None,
                "right": None,
                "left": None,
                "yawn": None,
                "battery": None,
            })
        self.assertEqual(drone.get_state(), result)

    def test_createDataBase(self):
        fakeMission = {
            "id": 0,
            "name": "test",
            "date": "2020/10/2",
            "time": "12:00",
            "type": "sim",
            "totalDistance": 0,
            "nbDrones": 2,
            "map": ["", ""],
            "logs": "",
        }
        self.assertEqual(self.db.add_mission(fakeMission), 0)

    def test_jsonyfie_mission(self):
        fakeMission = [[0, "test", "2020/10/2", "12:00", "sim", 0, 2, [], ""]]
        data = {
            "id": fakeMission[0][0],
            "name": str(fakeMission[0][1]),
            "date": str(fakeMission[0][2]),
            "time": str(fakeMission[0][3]),
            "type": str(fakeMission[0][5]),
            "totalDistance": 0,
            "nbDrones": fakeMission[0][6],
            "map": fakeMission[0][7],
            "logs": fakeMission[0][8],
        }
        result = [json.dumps(data)]
        self.assertEqual(self.db.jsonify_missions(fakeMission), result)

    @mock.patch.object(CommandHandler, "switch_handler")
    def test_handle_command_mode_physic(self, mock):
        self.commandHandler.handle_command(Command.MODE.value, self.MODE_PHYSIC)
        mock.assert_called()

    @mock.patch.object(CommandHandler, "switch_handler")
    def test_handle_command_mode_simmulation(self, mock):
        self.commandHandler.handle_command(Command.MODE.value, self.MODE_SIMULATION)
        mock.assert_called()

    @mock.patch.object(Database, "add_mission")
    def test_handle_command_new_mission(self, mock):
        self.commandHandler.handle_command(Command.NEW_MISSION.value, "")
        mock.assert_called()

    @mock.patch.object(Database, "get_mission_history")
    def test_handle_command_mission_history(self, mock):
        self.commandHandler.handle_command(Command.MISSION_HISTORY.value, "")
        mock.assert_called()

    @mock.patch.object(Database, "delete_mission")
    def test_handle_command_delete_mission(self, mock):
        self.commandHandler.handle_command(Command.DELETE_MISSION.value, "")
        mock.assert_called()

    def test_argos_release(self):
        print("release should close all clients and empty client list")
        socket_attributes = ["__init__", "close"]
        mock_socket = mock.Mock(name="socket", spec=socket_attributes)
        self.argos_handler.clients = [mock_socket, mock_socket, mock_socket]

        num_clients = len(self.argos_handler.clients)
        self.argos_handler.release()

        self.assertEqual(mock_socket.close.call_count, num_clients)
        self.assertEqual(len(self.argos_handler.clients), 0)

    @mock.patch.object(ArgosHandler, "broadcast_data")
    def test_argos_handle_command(self, mock_broadcast: mock.Mock):
        print("handle_command should call broadcast_data")

        cmd = 1
        self.argos_handler.handle_command(cmd, None)

        mock_broadcast.assert_has_calls(
            [mock.call(struct.pack("I", 0)), mock.call(struct.pack("I", cmd))]
        )

    @mock.patch.object(struct, "unpack")
    @mock.patch.object(ArgosHandler, "update_info")
    def test_argos_receive_info(
        self, mock_unpack: mock.Mock, mock_update_info: mock.Mock
    ):
        print("receive_info should call recv, update_info and unpack and return true")

        socket_attributes = ["__init__", "recv"]
        mock_socket = mock.Mock(name="socket", spec=socket_attributes)

        receiving = self.argos_handler.receive_info(mock_socket, Drone(0))

        mock_socket.recv.assert_called()
        mock_update_info.assert_called()
        mock_unpack.assert_called()
        self.assertEqual(receiving, True)

    def test_argos_receive_info_exception(self):
        print("receive_info should return False on exception")

        socket_attributes = ["__init__", "recv"]
        mock_socket = mock.Mock(name="socket", spec=socket_attributes)

        mock_socket.recv.side_effect = Exception()

        receiving = self.argos_handler.receive_info(mock_socket, Drone(0))

        mock_socket.recv.assert_called()
        self.assertEqual(receiving, False)

    def test_broadcast_data(self):
        print("broadcast_data should send to all clients")

        socket_attributes = ["__init__", "sendall"]
        mock_socket = mock.Mock(name="socket", spec=socket_attributes)
        self.argos_handler.clients = [mock_socket, mock_socket, mock_socket]
        num_clients = len(self.argos_handler.clients)

        cmd = 3
        self.argos_handler.broadcast_data(struct.pack("I", cmd))

        self.assertEqual(mock_socket.sendall.call_count, num_clients)
        mock_socket.sendall.assert_called_with(struct.pack("I", cmd))

    @mock.patch.object(Drone, "get_state")
    def test_get_state(self, mock_get_state: mock.Mock):
        print("get_state should return a list of states of each Drone")

        mock_get_state.return_value = 1
        self.argos_handler.drones = [Drone(0), Drone(0), Drone(0)]

        drone_states = self.argos_handler.get_state()

        self.assertEqual(drone_states, [1, 1, 1])

    def test_drone_update_info(self):
        print("update_info should set a drone correctly")

        drone = Drone(1)
        info = []
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)
        info.append(2)

        self.argos_handler.update_info(drone, info)

        drone_states = drone.get_state()

        data = json.dumps(
            {
                "id": 1,
                "state": 2,
                "x": 2,
                "y": 2,
                "z": 2,
                "front": 2,
                "back": 2,
                "right": 2,
                "left": 2,
                "yawn": None,
                "battery": 2,
            }
        )

        self.assertEqual(drone_states, data)

    @mock.patch.object(CrazyflieDrone, "release")
    def test_crazyflie_release(self, mock_crazyflie_drone: mock.Mock):
        print("release should release all crazyflies connected")

        self.crazyflie_handler.crazyflies_connected["0"] = CrazyflieDrone(0, "0")
        self.crazyflie_handler.crazyflies_connected["1"] = CrazyflieDrone(1, "1")

        num_connected = len(self.crazyflie_handler.crazyflies_connected)
        self.crazyflie_handler.release()

        self.assertEqual(mock_crazyflie_drone.call_count, num_connected)
        self.assertEqual(len(self.crazyflie_handler.crazyflies_connected), 0)

    @mock.patch.object(CrazyflieHandler, "scan_interfaces")
    def test_crazyflie_handle_command_scan(self, mock_scan: mock.Mock):
        print("handle_command should call scan_interfaces with arg SCAN")

        self.crazyflie_handler.handle_command(Command.SCAN.value, "")
        mock_scan.assert_called()

    @mock.patch.object(CrazyflieHandler, "connect")
    def test_crazyflie_handle_command_connect(self, mock_connect: mock.Mock):
        print("handle_command should call connect with arg CONNECT")

        self.crazyflie_handler.handle_command(Command.CONNECT.value, "")
        mock_connect.assert_called()

    @mock.patch.object(CrazyflieDrone, "send_data")
    def test_crazyflie_handle_command_other(self, mock_drone: mock.Mock):
        print("handle_command should send data for any other command")

        self.crazyflie_handler.crazyflies_connected["0"] = CrazyflieDrone(0, "0")
        self.crazyflie_handler.handle_command(Command.START.value, "0")

        mock_drone.assert_called_with(struct.pack("I", Command.START.value))

    @mock.patch.object(Drone, "get_state")
    def test_crazyflie_get_state(self, mock_drone: mock.Mock):
        print("get state should return list of states of all crazyflies")
        self.crazyflie_handler.crazyflies_connected["0"] = CrazyflieDrone(0, "0")
        drone_states = 1
        self.crazyflie_handler.get_state()
        self.assertEqual(len(self.crazyflie_handler.get_state()), drone_states)


if __name__ == "__main__":
    unittest.main()
