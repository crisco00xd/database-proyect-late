from flask import jsonify
from api.dao.unavailabletimestamps import UnavailableTimestamps
from api.util.utilities import Utilities


class UnavailableTimestampsHandler:

    @staticmethod
    def getAllUnavailableTimestamps():
        try:
            unavailabletimestamp = UnavailableTimestamps.getUnavailableTimestamps()
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getUnavailableTimestampsNameById(sid):
        try:
            UnavailableTimestamp = UnavailableTimestamps.getUnavailableTimestampsById(sid)
            UnavailableTimestamps_name = Utilities.to_dict(UnavailableTimestamp)['stat']
            return UnavailableTimestamps_name
        except Exception as e:
            return jsonify(message="Server error", error=e.__str__()), 500

    @staticmethod
    def makeTimeInRoomUnavailable(sid):
        try:
            UnavailableTimestamp = UnavailableTimestamps.makeTimeInRoomUnavailable(sid)
            return UnavailableTimestamp
        except Exception as e:
            print(e)
            return jsonify(message="Server error", error=e.__str__()), 500

    @staticmethod
    def makeUserTimeBusy(sid):
        try:
            UnavailableTimestamp = UnavailableTimestamps.makeUserTimeBusy(sid)
            return UnavailableTimestamp
        except Exception as e:
            return jsonify(message="Server error", error=e.__str__()), 500

    @staticmethod
    def getFreeTimeForMeetings(sid):
        try:
            unavailabletimestamp = UnavailableTimestamps.getFreeTimeForMeetings(sid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500


    @staticmethod
    def findBusiestHours(sid):
        try:
            unavailabletimestamp = UnavailableTimestamps.findBusiestHours(sid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def findMostBookedUsers(sid):
        try:
            unavailabletimestamp = UnavailableTimestamps.findMostBookedUsers(sid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def findMostBookedRoom(sid):
        try:
            unavailabletimestamp = UnavailableTimestamps.findMostBookedRoom(sid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def findMostUsedRoom(sid):
        try:
            unavailabletimestamp = UnavailableTimestamps.findMostUsedRoom(sid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Available": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500
