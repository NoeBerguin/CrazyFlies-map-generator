import json


class Drone:
    def __init__(self, id: int):
        self.id = id
        self.state = None
        self.x = None
        self.y = None
        self.z = None
        self.back = None
        self.front = None
        self.left = None
        self.right = None
        self.yaw = None
        self.battery = None
        self.is_connected = False

    def get_state(self) -> list:
        return json.dumps(
            {
                "id": self.id,
                "state": self.state,
                "x": self.x,
                "y": self.y,
                "z": self.z,
                "front": self.front,
                "back": self.back,
                "right": self.right,
                "left": self.left,
                "yawn": self.yaw,
                "battery": self.battery,
            }
        )
