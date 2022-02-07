from flask import jsonify, session
from api.dao.uservisits import UserVisit
from api.util.utilities import Utilities


class UserVisitHandler:

    @staticmethod
    def getUserVisit(tid):
        try:
            reports = UserVisit.getUserVisit(tid)
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
    def getAllUserVisit():
        try:
            userVisit = UserVisit.getAllUserVisit()
            result_list = []
            for report in UserVisit:
                result_list.append(Utilities.to_dict(report))
            result = {
                "message": "Success!",
                "result": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def createUserVisit(report):
        try:
            queryResponse = UserVisit.createUserVisit(report)
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
            response = UserVisit.getLatestReport(tool_id)
            userVisit = None
            for report in response:
                userVisit = Utilities.raw_sql_to_dict(report)
            result = {
                "message": "Success!",
                "result": UserVisit
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500
        
    @staticmethod
    def updateUserVisit(tool_report):
        try:
            requestResponse = UserVisit.updateUserVisit(tool_report)
            result = {
                "message": "Success!",
                "response": requestResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def deleteUserVisit(report_id):
        try:
            queryResponse = UserVisit.deleteUserVisit(report_id)
            result = {
                "message": "Success!",
                "response": queryResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500