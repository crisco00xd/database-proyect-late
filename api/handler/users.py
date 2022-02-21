from flask import jsonify, session
from backend.api.dao.users import Users
from backend.api.util.utilities import Utilities


class UsersHandler:

    @staticmethod
    def getAllUsers():
        try:
            users = Users.getUsers()
            result_list = []
            for user in users:
                result_list.append(Utilities.to_dict(user))
            result = {
                "message": "Success!",
                "users": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getUserById(uid):
        try:
            user = Users.getUserById(uid)
            d, a = {}, []
            for rowproxy in user:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "User": a
            }
            return jsonify(result) , 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    def getUserByEmail(uid):
        try:
            user = Users.getUserByEmail(uid)
            d, a = {}, []
            for rowproxy in user:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "user": a
            }
            return jsonify(result) , 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getUserSchedule(uid):
        try:
            user = Users.getUserSchedule(uid)
            d, a = {}, []
            for rowproxy in user:
                # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "message": "Success!",
                "Appointments": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def createUser(pid):
        try:
            checkDup = UsersHandler.getUserByEmail(pid)
            print(checkDup)
            if len(checkDup[0].json['user']) > 0:
                return jsonify(reason="Email Already Exists"), 200

            user = Users.createUser(pid)
            result = {
                "message": "Success Creating user!",
                "Status": user
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def updateUser(user):
        try:
            requestResponse = Users.updateUser(user)
            result = {
                "message": "Success!",
                "response": requestResponse
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500  
    
    @staticmethod
    def deleteUser(pid):
        try:
            user = Users.deleteUser(pid)
            print(user)
            result = {
                "message": user
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500
    
    @staticmethod
    def login(json):
        try:
            print(type(json))
            if json['email'] == "" or json['password'] == "":
                return jsonify(reason="Must fill both username and password fields."), 200
            user = UsersHandler.getUserByEmail(json)
            print(user[0].json)
            if len(user[0].json['user']) == 0:
                return jsonify(reason="Incorrect email or password."), 200
            user_id = user[0].json['user'][0]['user_id']
            password = user[0].json['user'][0]['password']
            if user and password == json['password']:
                session['logged_in'] = True
                status = True
                result = {
                    "message": "Success!",
                    "user": user[0].json['user'][0]
                }
                return jsonify(result), 200
            else:
                return jsonify(reason="Incorrect email or password."), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def logout():
        try:
            session['logged_in'] = False
            return jsonify(status='Success!'), 200
        except Exception as err:
            return jsonify(reason="Server error!", error=err.__str__()), 500
