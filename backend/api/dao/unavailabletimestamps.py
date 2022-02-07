from api.util.config import db
from sqlalchemy import text


class UnavailableTimestamps(db.Model):
    __tablename__ = 'unavailabletimestamps'
    time_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('users.user_id'))
    room_id = db.Column(db.ForeignKey('room.room_id'))
    date_reserved = db.Column(db.TIMESTAMP, nullable=False)
    date_end = db.Column(db.TIMESTAMP, nullable=True)
    comment = db.Column(db.String(200), nullable=True)

    def __init__(self, **args):
        self.user_id = args.get('user_id')
        self.room_id = args.get('room_id')
        self.date_reserved = args.get('date_reserved')
        self.date_end = args.get('date_end')
        self.comment = args.get('comment')

    @property
    def pk(self):
        return self.UnavailableTimestamps_id

    # TODO FIX NON RELATIONAL QUERIES

    @staticmethod
    def getUnavailableTimestamps():
        try:
            sql = text("Select * from unavailabletimestamps")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getUnavailableTimestampsById(stat_id):
        return UnavailableTimestamps().query.filter_by(UnavailableTimestamps_id=stat_id).first()

    @staticmethod
    def makeTimeInRoomUnavailable(rid):
        try:
            if int(rid['rank_id']) == 1 or int(rid['rank_id']) == 2:
                return "UR NOT AUTHORIZED TO DO THIS"

            sql = text(
                "Insert into unavailabletimestamps(user_id, room_id, date_reserved, date_end, comment) values (:user_id, :room_id, :date_reserved, :date_end, :comment)")

            db.engine.execute(sql, {
                "user_id": rid["user_id"],
                "room_id": rid["room_id"],
                "date_reserved": rid["date_reserved"],
                "date_end": rid["date_end"],
                "comment": rid["comment"]
            })
            return "Success Adding Room Unavailable Time"

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def makeUserTimeBusy(rid):
        try:
            sql = text(
                "Insert into unavailabletimestamps(user_id, date_reserved, date_end, comment) values (:user_id, :date_reserved, :date_end, :comment)")

            db.engine.execute(sql, {
                "user_id": rid["user_id"],
                "date_reserved": rid["date_reserved"],
                "date_end": rid["date_end"],
                "comment": rid["comment"]
            })
            return "Success Adding User Unavailable Time"

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getFreeTimeForMeetings(rid):
        try:
            sql = text("Select Distinct on (room_id) room.room_id, name, date_end From room natural inner join appointments Where room.room_id not in (Select room_id from unavailabletimestamps Where (:td >= date_reserved and :td <= date_end) or (:td2 >= date_reserved and :td2 <= date_end) or (:td <= date_reserved and :td2 >= date_end))")
            return db.engine.execute(sql, {"td": rid["timeframe1"],
                                           "td2": rid['timeframe2']})
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findBusiestHours(rid):
        try:
            sql = text("SELECT to_char(date_reserved, 'HH24:MI') as Most_Appointed_Starting_time, to_char(date_end, 'HH24:MI') as Most_Appointed_Ending_time, count(*) as amount_of_appointments from appointments GROUP BY Most_Appointed_Starting_time, Most_Appointed_Ending_time order by  amount_of_appointments desc limit 5")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostBookedUsers(rid):
        try:
            sql = text("select user_id, count(*) as count from unavailabletimestamps group by user_id order by count desc limit 10;")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostBookedRoom(rid):
        try:
            sql = text("select room_id, count(*) as count from appointments group by room_id order by count desc limit 10")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostUsedRoom(rid):
        try:
            sql = text("select room_id, count(*) as count from appointments group by room_id order by count desc limit 1")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error
