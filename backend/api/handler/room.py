from flask import jsonify
from api.dao.room import Room
from api.util.utilities import Utilities


class RoomHandler:

    @staticmethod
    def getAllRoom():
        try:
            room = Room.getRoom()
            d, a = {}, []
            for rowproxy in room:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Room": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getRoomById(pid):
        try:
            room = Room.getRoomById(pid)
            d, a = {}, []
            for rowproxy in room:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Room": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getroomByName(rid):
        try:
            room = Room.getroomByName(rid)
            d, a = {}, []
            for rowproxy in room:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Room": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500


    @staticmethod
    def createRoom(pid):
        try:
            room = Room.create(pid)
            result = {
                "message": "Success Creating Room!",
                "Status": room
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def deleteRoom(pid):
        try:
            room = Room.delete(pid)
            result = {
                "message": "Success Deleting!",
                "Status": room
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def updateStock(pid):
        try:
            room = Room.updateStock(pid)
            result = {
                "message": "Success Updating Stock!",
                "Status": room
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def updateRoom(pid):
        try:
            room = Room.updateRoom(pid)
            result = {
                "message": "Success Updating Room!",
                 "Status": room
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500
