from api.util.config import db
from sqlalchemy import text

from api.util.utilities import Utilities


class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(64), nullable=False)
    rank_id = db.Column(db.Integer, nullable=False)  # 0 = admin, 1 = student, 2 = professor, 3 = department_staff

    def __init__(self, **args):
        self.first_name = args.get('first_name')
        self.last_name = args.get('last_name')
        self.email = args.get('email')
        self.password = args.get('password')
        self.rank_id = args.get('rank_id')


    @property
    def pk(self):
        return self.user_id

    # TODO FIX NON RELATIONAL QUERIES

    @staticmethod
    def getUsers():
        return Users().query.all()

    @staticmethod
    def getUserById(uid):
        sql = text("Select * from users Where user_id= :uid")
        try:
            return db.engine.execute(sql, {'uid': uid['user_id']})


        except Exception as error:
            return error

    @staticmethod
    def getUserByEmail(rid):
        sql = text("Select * from users Where email = :uemail")
        try:
            return db.engine.execute(sql, {'uemail': rid['email']})

        except Exception as error:
            print('Error:' + error)
            return error

    # create user
    @staticmethod
    def createUser(user):
        sql = text("insert into users\
            (first_name,last_name,email,password,rank_id) \
            VALUES(:first_name,:last_name,:email,:password,:rank_id)")
        try:
            db.engine.execute(sql,
                              {'first_name': user['first_name'],
                               'last_name': user['last_name'],
                               'email': user['email'],
                               'password': user['password'],
                               'rank_id': user['rank_id']
                               })
            return 'Successfully Created New User'
        except Exception as error:
            print(error)
            return 'Error Creating User'

    @staticmethod
    def getUserSchedule(user):
        sql = text(
            "Select first_name, last_name, unavailabletimestamps.date_reserved, unavailabletimestamps.date_end, unavailabletimestamps.comment, room_id From users natural inner join unavailabletimestamps Where :td = unavailabletimestamps.user_id or unavailabletimestamps.user_id = 0")
        try:
            return db.engine.execute(sql, {"td": user["user_id"]})
        except:
            return 'Error Searching User Schedule'

    # update user
    @staticmethod
    def updateUser(user):
        if user['email'] != user['email1']:
            from api.handler.users import UsersHandler
            response = UsersHandler.getUserByEmail(user)
            print(response[0].json)
            if response[0].json['user']:
                return 'A User With Email: ' + user['email'] + ' Exists In Our System'

        sql = text("UPDATE users\
            SET \
            first_name = :first_name \
            ,last_name = :last_name \
            ,email = :email \
            ,password = :password \
            ,rank_id = :rank_id \
            WHERE user_id = :user_id")
        try:
            db.engine.execute(sql,
                              {'first_name': user['first_name'],
                               'last_name': user['last_name'],
                               'email': user['email'],
                               'password': user['password'],
                               'rank_id': user['rank_id'],
                               'user_id': user['user_id']
                               })
            return 'Successfully Edited User'
        except Exception as error:
            print(error)
            return error

    # delete user
    @staticmethod
    def deleteUser(uid):
        sql = text("delete from users where user_id = :uid")
        try:
            db.engine.execute(sql, {'uid': uid['user_id']})
            return "Success Deleting User"
        except Exception as error:
            print(error)
            return 'Error Deleting User'
