##########################################################
### this file is use to test drone firmware with a PS4
### controller. There is no unit test for this file. 
##########################################################
import threading
from .drone.command import Command
from pyPS4Controller.controller import Controller

class MyController(Controller):
    LIMIT = 12000
    direction = [0,0,0,0]
    handler = None

    def start_listening(self):
        self.process = threading.Thread(target=self.listen)
        self.process.start()

    def set_handler(self, handler):
        self.handler = handler

    def send_command(self):
        if self.handler:
            if self.direction == [1,0,0,0]:
                self.handler.sendCommand(Command.UP.value)
            elif self.direction == [0,1,0,0]:
                self.handler.sendCommand(Command.DOWN.value)
            elif self.direction == [0,0,1,0]:
                self.handler.sendCommand(Command.RIGHT.value)
            elif self.direction == [0,0,0,1]:
                self.handler.sendCommand(Command.LEFT.value)
            elif self.direction == [1,0,1,0]:
                self.handler.sendCommand(Command.UP_RIGHT.value)
            elif self.direction == [1,0,0,1]:
                self.handler.sendCommand(Command.UP_LEFT.value)
            elif self.direction == [0,1,1,0]:
                self.handler.sendCommand(Command.DOWN_RIGHT.value)
            elif self.direction == [0,1,0,1]:
                self.handler.sendCommand(Command.DOWN_LEFT.value)
            elif self.direction == [0,0,0,0]:
                self.handler.sendCommand(Command.CENTER.value)    

    def start_drone(self):
        if self.handler:
            self.handler.sendCommand(5)
    
    def stop_drone(self):
        if self.handler:
            self.handler.sendCommand(6)

    def debug_drone(self):
        if self.handler:
            self.handler.sendCommand(30)

    def __init__(self, **kwargs):
        Controller.__init__(self, **kwargs)

    def on_x_press(self):
        self.start_drone()

    def on_x_release(self):
        self.start_drone()

    def on_circle_press(self):
        self.stop_drone()

    def on_circle_release(self):
        self.stop_drone()

    def on_square_press(self):
        self.debug_drone()

    def on_triangle_press(self):
        if self.handler:
            self.handler.sendCommand(3)

    def on_R1_press(self):
        if self.handler:
            self.handler.sendCommand(40)

    def on_L1_press(self):
        if self.handler:
            self.handler.sendCommand(41)

    def on_L2_press(self, event):
        i = 0
    
    def on_L3_left(self, event):
        if abs(event)>self.LIMIT:
            self.direction[3] = 1
            self.send_command()
            
    def on_L3_right(self, event):
        if abs(event)>self.LIMIT:
            self.direction[2] = 1
            self.send_command()
            
        
    def on_L3_up(self, event):
        if abs(event)>self.LIMIT:
            self.direction[0] = 1
            self.send_command()
            

    def on_L3_down(self, event):
        if abs(event)>self.LIMIT:
            self.direction[1] = 1
            self.send_command()
            


    def on_L3_x_at_rest(self):
        self.direction = [0,0,0,0]
        self.send_command()
    
    def on_L3_y_at_rest(self):
        self.direction = [0,0,0,0]
        self.send_command()
