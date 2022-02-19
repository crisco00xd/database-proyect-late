from api.util.config import db
from sqlalchemy import text


class UserBusy(db.Model):
    __tablename__ = 'userbusy'
    visit_id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date_reserved = db.Column(db.TIMESTAMP, nullable=False)
    date_end = db.Column(db.TIMESTAMP, nullable=False)

    def __init__(self, **args):
        self.user_id = args.get('user_id')
        self.date_reserved = args.get('date_reserved')
        self.date_end = args.get('date_end')

    @property
    def pk(self):
        return self.user_id

    @staticmethod
    def getAllUserBusy():
        return UserBusy().query.all()

    @staticmethod
    def getUserBusy(user_id):
        try:
            sql = text("Select * From userbusy Where :user_id = user_id");
            return db.engine.execute(sql, {'user_id': user_id['user_id']})
        except Exception as error:
            return error

    @staticmethod
    def createVisit(uid):
        sql = text("insert into userbusy \
            (user_id, date_reserved, date_end) \
            VALUES(:user_id, :date_reserved, :date_end)")
        try:
            db.engine.execute(sql, {'user_id': uid['user_id'],
                                    'date_reserved': uid['date_reserved'],
                                    'date_end': uid['date_end']});
            return "Success Creating User Busy"
        except Exception as error:
            return error

    @staticmethod
    def updateVisit(rid):
        sql = text(
            "UPDATE userbusy SET date_reserved = :date_reserved, date_end = :date_end WHERE user_id = :user_id AND date_reserved = :date_reserved_old AND date_end = :date_end_old");
        try:
            db.engine.execute(sql,
                              {'user_id': rid['user_id'],
                               'date_reserved': rid['date_reserved'],
                               'date_end': rid['date_end'],
                               'date_reserved_old': rid['date_reserved_old'],
                               'date_end_old': rid['date_end_old']})
            return "Success Updating User Busy Status"
        except Exception as error:
            return error

    @staticmethod
    def deleteVisit(rid):
        sql = text(
            "delete from userbusy WHERE user_id = :user_id AND date_reserved = :date_reserved AND date_end = :date_end ")
        try:
            db.engine.execute(sql, {'user_id': rid['user_id'],
                                    'date_reserved': rid['date_reserved'],
                                    'date_end': rid['date_end']})
            return "Success Deleting User Busy Status"
        except Exception as error:
            return error
