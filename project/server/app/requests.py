import signal
from flask import jsonify, request
from flask.wrappers import Response

from app import app

from .command_handler import CommandHandler

command_handler = CommandHandler()

signal.signal(signal.SIGINT, command_handler.release)
signal.signal(signal.SIGTERM, command_handler.release)


@app.route("/command", methods=["POST", "GET"])
def command() -> Response:
    data = request.get_json()
    response = None
    if data != None:
        response = command_handler.handle_command(data["action"], data["arg"])
    return jsonify({"content": response})


@app.route("/packet/", methods=["POST", "GET"])
def packet() -> Response:
    response = command_handler.get_state()
    return jsonify({"content": response})
