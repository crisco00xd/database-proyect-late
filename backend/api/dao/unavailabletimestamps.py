from api.util.config import db
from sqlalchemy import text

from api.handler.users import UsersHandler

from api.handler.room import RoomHandler

from api.handler.appointments import AppointmentsHandler


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
    def deleteBusyRoom(rid):
        try:
            sql = text("delete from unavailabletimestamps Where  date_reserved = :date_reserved AND user_id = 0")
            db.engine.execute(sql, {'date_reserved': rid['date_reserved']})
            return "Success"
        except Exception as error:
            print(error)
            return error
    @staticmethod
    def getUnavailableTimestampsById(stat_id):
        return UnavailableTimestamps().query.filter_by(UnavailableTimestamps_id=stat_id).first()

    @staticmethod
    def deleteUnavailableTimestamps(rid):
        try:
            user_ids = []
            for email in rid['deleted_members']:
                request = {
                    "email": email
                }
                response = UsersHandler.getUserByEmail(request)
                userID = response[0].json['user'][0]['user_id']
                user_ids.append(int(userID))

            counter = 0
            while counter < len(user_ids):
                sql = text("delete from unavailabletimestamps Where user_id = :uid AND date_reserved = :date_reserved")
                db.engine.execute(sql, {'uid': int(user_ids[counter]),
                                        'date_reserved': rid['date_reserved']})
                counter = counter + 1
                continue
            return "Success Clearing Unavailable Timestamp"
        except Exception as error:
            print(error)
            return "Cannot Delete Busy"

    @staticmethod
    def makeTimeInRoomUnavailable(rid):
        try:
            if int(rid['rank_id']) == 1 or int(rid['rank_id']) == 2:
                return "UR NOT AUTHORIZED TO DO THIS"

            request = {
                "room_name": rid['room_name']
            }
            response = RoomHandler.getroomByName(request)
            if not response[0].json['Room']:
                return 'Room Does Not Exists'

            room_id = response[0].json['Room'][0]['room_id']
            request = {
                "timeframe1": rid["date_reserved"],
                "timeframe_end": rid["date_end"]
            }
            response1 = AppointmentsHandler.getAvailableRoomByTimeframe(request)
            found = False
            for i in range(len(response1[0].json['Appointments'])):
                if response1[0].json['Appointments'][i]['name'] == rid['room_name']:
                    found = True
                    break
                else:
                    continue

            if not found:
                return 'Room Has Meeting Pending Cannot Put Unavailable'

            sql = text(
                "Insert into unavailabletimestamps(user_id, room_id, date_reserved, date_end, comment) values (:user_id, :room_id, :date_reserved, :date_end, :comment)")

            db.engine.execute(sql, {
                "user_id": rid["user_id"],
                "room_id": room_id,
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
            sql = text(
                "Select Distinct on (room_id) room.room_id, name, date_end From room natural inner join appointments Where room.room_id not in (Select room_id from unavailabletimestamps Where (:td >= date_reserved and :td <= date_end) or (:td2 >= date_reserved and :td2 <= date_end) or (:td <= date_reserved and :td2 >= date_end))")
            return db.engine.execute(sql, {"td": rid["timeframe1"],
                                           "td2": rid['timeframe2']})
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findBusiestHours(rid):
        try:
            sql = text(
                "SELECT to_char(date_reserved, 'HH24:MI') as Most_Appointed_Starting_time, to_char(date_end, 'HH24:MI') as Most_Appointed_Ending_time, count(*) as amount_of_appointments from appointments GROUP BY Most_Appointed_Starting_time, Most_Appointed_Ending_time order by  amount_of_appointments desc limit 5")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostBookedUsers(rid):
        try:
            sql = text(
                "select first_name, last_name, count(*) as count from unavailabletimestamps natural inner join users group by first_name, last_name order by count desc limit 10;")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostBookedRoom(rid):
        try:
            sql = text("select name, count(*) as count from appointments natural inner join room group by name order by count desc limit 10")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def findMostUsedRoom(rid):
        try:
            sql = text(
                "select name, count(*) as count from appointments natural inner join room group by name order by count desc limit 1")
            return db.engine.execute(sql)
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def UserMostBookedUser(rid):
        try:
            sql = text(
                "with meeting as (select unavailabletimestamps.room_id, unavailabletimestamps.date_reserved, unavailabletimestamps.date_end from unavailabletimestamps where unavailabletimestamps.user_id = :uid), invitees as (select unavailabletimestamps.user_id, unavailabletimestamps.room_id, unavailabletimestamps.date_reserved, unavailabletimestamps.date_end  from unavailabletimestamps, meeting where unavailabletimestamps.room_id = meeting.room_id and unavailabletimestamps.date_reserved = meeting.date_reserved and unavailabletimestamps.date_end = meeting.date_end) select user_id, first_name, last_name, email, count(*) as user_count from users natural join invitees where users.user_id in (select invitees.user_id from invitees) and user_id != :uid group by user_id, first_name, last_name, email order by user_count desc limit 1")
            return db.engine.execute(sql, {
                "uid": rid['user_id']
            })
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def MostBookedRoomByUser(rid):
        try:
            sql = text(
                "select name, count(*) as count from unavailabletimestamps natural inner join room where user_id = :uid group by name order by count desc limit 1")
            return db.engine.execute(sql, {
                "uid": rid['user_id']
            })
        except Exception as error:
            print(error)
            return error
