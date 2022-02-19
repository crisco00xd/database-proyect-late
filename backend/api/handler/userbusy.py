from flask import jsonify, session
from api.dao.userbusy import UserBusy
from api.util.utilities import Utilities


class UserBusyHandler:

    @staticmethod
    def getUserBusy(tid):
        try:
            reports = UserBusy.getUserBusy(tid)
            result_list = []
            for report in reports:
                result_list.append(Utilities.raw_sql_to_dict(report))
            result = {
                "message": "Success!",
                "result": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getAllUserBusy():
        try:
            user_busy = UserBusy.getAllUserBusy()
            result_list = []
            for report in user_busy:
                result_list.append(Utilities.to_dict(report))
            result = {
                "message": "Success!",
                "result": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def createUserBusy(report):
        try:
            queryResponse = UserBusy.createVisit(report)
            result = {
                "message": "Success!",
                "response": queryResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getLatestReport(tool_id):
        try:
            response = UserBusy.getLatestReport(tool_id)
            UserBusy = None
            for report in response:
                UserBusy = Utilities.raw_sql_to_dict(report)
            result = {
                "message": "Success!",
                "result": UserBusy
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500
        
    @staticmethod
    def updateUserBusy(tool_report):
        try:
            requestResponse = UserBusy.updateUserBusy(tool_report)
            result = {
                "message": "Success!",
                "response": requestResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def deleteUserBusy(report_id):
        try:
            queryResponse = UserBusy.deleteUserBusy(report_id)
            result = {
                "message": "Success!",
                "response": queryResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500