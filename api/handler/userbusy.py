from flask import jsonify, session
from api.dao.userbusy import UserBusy
from api.util.utilities import Utilities


class UserBusyHandler:

    @staticmethod
    def getallUserBusy(tid):
        try:
            reports = UserBusy.getAllUserBusy(tid)
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
    def getUserBusy(rid):
        try:
            user_busy = UserBusy.getUserBusy(rid)
            d, a = {}, []
            for rowproxy in user_busy:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "response": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def createUserBusy(report):
        try:
            queryResponse = UserBusy.createVisit(report)
            result = {
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
            requestResponse = UserBusy.updateVisit(tool_report)
            result = {
                "response": requestResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def deleteUserBusy(report_id):
        try:
            queryResponse = UserBusy.deleteVisit(report_id)
            result = {
                "response": queryResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500