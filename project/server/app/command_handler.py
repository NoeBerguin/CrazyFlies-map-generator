from enum import Enum
import sys
from typing import Callable, Union

from .database import Database
from .drone import Command
from .drone import CrazyflieHandler
from .drone import ArgosHandler
from .ps4controller import MyController


class Mode(Enum):
    CRAZYFLIE = 0
    SIMULATION = 1


class CommandHandler:
    def __init__(self):
        self.database = Database()
        self.current_handler = None
        self.current_mode = 2

        # self.ps4Controller = MyController(
        #     interface="/dev/input/js0", connecting_using_ds4drv=False
        # )
        # # you can start listening before controller is paired, as long as you pair it within the timeout window
        # self.ps4Controller.startListening()

    def handle_command(
        self, command: int, arg: Union[int, dict, str]
    ) -> Union[None, list, int]:
        if command == Command.MODE.value:
            self.change_mode(arg)
        elif command == Command.NEW_MISSION.value:
            self.database.add_mission(arg)

        elif command == Command.MISSION_HISTORY.value:
            return self.database.get_mission_history()

        elif command == Command.DELETE_MISSION.value:
            self.database.delete_mission(arg)

        else:
            if self.current_handler != None:
                return self.current_handler.handle_command(command, str(arg))

    def change_mode(self, mode: int) -> None:
        if mode == Mode.CRAZYFLIE.value:
            self.switch_handler(mode, CrazyflieHandler)
        elif mode == Mode.SIMULATION.value:
            self.switch_handler(mode, ArgosHandler)
        else:
            self.current_handler = None

    def switch_handler(self, mode: int, handler: Callable) -> None:
        if self.current_handler != None and self.current_mode != mode:
            self.current_handler.release()
        if self.current_mode != mode:
            self.current_handler = handler()
            # if mode == Mode.CRAZYFLIE.value:
            #     self.ps4Controller.set_handler(self.current_handler)

        self.current_mode = mode

    def release(self, *_) -> None:
        if self.current_handler != None:
            self.current_handler.release()
        sys.exit(0)

    def get_state(self) -> "list | None":
        if self.current_handler != None:
            return self.current_handler.get_state()
