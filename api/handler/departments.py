from flask import jsonify
from api.dao.departments import Departments
from api.util.utilities import Utilities


class DepartmentsHandler:

    @staticmethod
    def getAllDepartments():
        try:
            departments = Departments.getDepartments()
            result_list = []
            for dept in departments:
                result_list.append(Utilities.to_dict(dept))
            result = {
                "message": "Success!",
                "departments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(message="Server error", error=e.__str__()), 500

    @staticmethod
    def getDepartmentById(did):
        try:
            department = Departments.getDepartmentById(did)
            department_dict = Utilities.to_dict(department)
            result = {
                "message": "Success!",
                "department": department_dict
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(message="Server error", error=e.__str__()), 500
