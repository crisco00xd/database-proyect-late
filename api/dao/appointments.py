import json

import sqlalchemy
from flask import jsonify
from sqlalchemy import text, String
from api.util.config import db
import datetime
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from api.dao.room import Room

from api.dao.users import Users
from api.handler.users import UsersHandler
from api.util.utilities import Utilities


class Appointments(db.Model):
    __tablename__ = 'appointments'
    appointment_id = db.Column(db.Integer, primary_key=True)
    date_reserved = db.Column(db.TIMESTAMP, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.room_id'), nullable=False)
    date_end = db.Column(db.TIMESTAMP, nullable=True)
    rank_id = db.Column(db.Integer, nullable=False)
    status_id = db.Column(db.Integer, nullable=False)
    members = db.Column(ARRAY(String))
    total_members = db.Column(db.Integer, nullable=False)

    def __init__(self, **args):
        self.date_reserved = args.get('date_reserved')
        self.owner_id = args.get('owner_id')
        self.date_end = args.get('date_end')
        self.appointment_id = args.get('appointment_id')
        self.rank_id = args.get('rank_id')
        self.room_id = args.get('room_id')
        self.status_id = args.get('status_id')
        self.members = args.get('members')
        self.total_members = args.get('total_members')

    # TODO FIX NON RELATIONAL QUERIES
    @property
    def pk(self):
        return self.appointment_id

    @staticmethod
    def getAppointments():
        return Appointments().query.all()

    @staticmethod
    def getAppointmentById(aid):
        sql = text("Select * from appointments Where appointmentid= :aid")
        try:
            db.engine.execute(sql, {'appointment_id': aid})
            return "Success"

        except:
            return "Error"

    @staticmethod
    def getAppointmentByRoomAndTime(uid):
        sql = text(
            "Select * From appointments Where room_id = :td AND date_reserved = :td2")
        try:
            return db.engine.execute(sql, {'td': uid['room_id'],
                                           'td2': uid['date_reserved']})
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getWhoAppointedRoomByTime(tid):
        sql = text(
            "Select first_name, last_name, email, date_reserved, date_end, name From appointments natural inner join users natural inner join room Where date_reserved >= :td  AND date_end <= :td2 ORDER BY date_reserved")
        try:
            return db.engine.execute(sql, {'td': tid['timeframe'],
                                           'td2': tid['timeframe2']})
        except Exception as error:
            return error

    @staticmethod
    def getAvailableRoomByTime(tid):
        sql = text(
            "Select Distinct on (room_id) room.room_id, name From room, unavailabletimestamps Where room.room_id not in (Select room_id from unavailabletimestamps) OR date_end < :td")
        try:
            return db.engine.execute(sql, {'td': tid['timeframe']})
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getAvailableRoomByTimeframe(tid):
        sql = text(
            "Select Distinct on (room_id) room.room_id, room.name From room Where room.room_id not in (Select room_id from unavailabletimestamps Where :td < date_reserved AND :td2 > date_end)")
        try:
            return db.engine.execute(sql, {'td': tid['timeframe1'],
                                           'td2': tid['timeframe_end']})
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getRoomSchedule(tid):
        sql = text(
            "Select room.room_id, room.name, appointments.date_reserved, appointments.date_end From appointments natural inner join room Where :td = appointments.room_id")
        try:
            return db.engine.execute(sql, {'td': tid['room_id']})
        except Exception as error:
            return error

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def getOverlappingTimestamps(user_ids, rid):
        try:
            unavailabletimestamp = Appointments.getOverlappingMeetings(user_ids,rid)
            d, a = {}, []
            for rowproxy in unavailabletimestamp:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "appoints": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getOverlappingMeetings(user_ids, rid):
        try:
            conditional_statement = "%s = '%s'" % ("user_id", str(user_ids[0]))
            for i in range(1, len(user_ids)):
                conditional_statement += " or %s = '%s'" % ("user_id", str(user_ids[i]))

            query = "SELECT date_reserved, date_end from \"users\" natural join \"unavailabletimestamps\" \
            natural join \"appointments\" where (" + conditional_statement + ") and \
            ( \
                (date_reserved between :date_reserved \
                and :date_end \
                or date_end between :date_reserved \
                and :date_end \
     \
                or (date_reserved <= :date_reserved and \
                date_end >= :date_end)) \
            ) \
            UNION ALL SELECT date_reserved, date_end from \"users\" natural join \"userbusy\" where (" + conditional_statement + ") and \
                (date_reserved between :date_reserved \
                and :date_end \
                or date_end between :date_reserved \
                and :date_end \
                or (date_reserved <= :date_reserved and \
                date_end >= :date_end))"

            sql = text(query)

            return db.engine.execute(sql, {'date_reserved': rid['date_reserved'],
                                           'date_end': rid['date_end']})
        except Exception as error:
            print(error)
            return "Could not do query"

    @staticmethod
    def createMeeting(rid):
        try:
            user_ids = []

            for email in rid['members']:
                request = {
                    "email": email
                }
                response = UsersHandler.getUserByEmail(request)
                userID = response[0].json['user'][0]['user_id']
                user_ids.append(int(userID))

            result = Appointments.getOverlappingTimestamps(user_ids, rid)

            if(len(result[0].json['appoints']) > 0):
                print(result[0].json['appoints'])
                return "Timeframe Conflicts With Selected Users Schedule"

            sql = text(
                "Insert into appointments(date_reserved, owner_id, room_id, date_end, rank_id, status_id, members, total_members) values (:date_reserved, :uid, :td, :date_end, :rank_id, :status_id, :members, :total_members)")
            db.engine.execute(sql, {'members': rid['members'],
                                    'td': int(rid['room_id']),
                                    'date_reserved': rid['date_reserved'],
                                    'date_end': rid['date_end'],
                                    'rank_id': int(rid['rank_id']),
                                    'status_id': int(rid['status_id']),
                                    'total_members': int(rid['total_members']),
                                    'uid': int(rid['owner_id'])})
            counter = 0
            while counter < int(rid['total_members']):
                sql = text(
                    "Insert into unavailabletimestamps(user_id,room_id, date_reserved, date_end, comment) values (:uid, :td, :date_reserved, :date_end, :comment)")
                db.engine.execute(sql, {'uid': int(user_ids[counter]),
                                        'td': int(rid['room_id']),
                                        'date_reserved': rid['date_reserved'],
                                        'date_end': rid['date_end'],
                                        'comment': rid['comment']})
                counter = counter + 1
                continue
            return 'Success Creating Meeting'
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def updateAppointment(rid):
        try:
            user_ids = []
            for email in rid['members']:
                request = {
                    "email": email
                }
                response = UsersHandler.getUserByEmail(request)
                userID = response[0].json['user'][0]['user_id']
                user_ids.append(int(userID))

            sql = text(
                "Update appointments Set date_reserved = :date_reserved1, owner_id = :uid, room_id = :td, date_end = :date_end, rank_id = :rank_id, status_id = :status_id, members = :members, total_members = :total_members  Where owner_id = :uid AND date_reserved = :date_reserved")
            db.engine.execute(sql, {'members': rid['members'],
                                    'td': int(rid['room_id']),
                                    'date_reserved': rid['date_reserved'],
                                    'date_reserved1': rid['date_reserved1'],
                                    'date_end': rid['date_end'],
                                    'rank_id': int(rid['rank_id']),
                                    'status_id': int(rid['status_id']),
                                    'total_members': int(rid['total_members']),
                                    'uid': int(rid['owner_id'])})
            counter = 0
            while counter < int(rid['total_members']):
                sql = text(
                    "Update unavailabletimestamps Set user_id = :uid,room_id = :td, date_reserved = :date_reserved1, date_end = :date_end, comment = :comment Where user_id = :uid AND date_reserved = :date_reserved")
                db.engine.execute(sql, {'uid': int(user_ids[counter]),
                                        'td': int(rid['room_id']),
                                        'date_reserved': rid['date_reserved'],
                                        'date_reserved1': rid['date_reserved1'],
                                        'date_end': rid['date_end'],
                                        'comment': rid['comment']})
                counter = counter + 1
                continue
            return 'Success Updating Meeting'
        except Exception as error:
            print(error)
            return error

    @staticmethod
    def cancelAppointment(rid):
        appointment = Appointments.getAppointmentById(rid)
        appointment.status_id = 3
        db.session.commit()
        return appointment

    @staticmethod
    def deleteAppointment(rid):
        try:
            user_ids = []
            for email in rid['members']:
                request = {
                    "email": email
                }
                response = UsersHandler.getUserByEmail(request)
                userID = response[0].json['user'][0]['user_id']
                user_ids.append(int(userID))

            sql = text("delete from appointments where owner_id = :uid AND date_reserved = :date_reserved")
            db.engine.execute(sql, {'members': rid['members'],
                                    'td': int(rid['room_id']),
                                    'date_reserved': rid['date_reserved'],
                                    'date_end': rid['date_end'],
                                    'rank_id': int(rid['rank_id']),
                                    'status_id': int(rid['status_id']),
                                    'total_members': int(rid['total_members']),
                                    'uid': int(rid['owner_id'])})
            counter = 0
            while counter < int(rid['total_members']):
                sql = text("delete from unavailabletimestamps Where user_id = :uid AND date_reserved = :date_reserved")
                db.engine.execute(sql, {'uid': int(user_ids[counter]),
                                        'td': int(rid['room_id']),
                                        'date_reserved': rid['date_reserved'],
                                        'date_end': rid['date_end'],
                                        'comment': rid['comment']})
                counter = counter + 1
                continue
            return 'Success Deleting Meeting'
        except Exception as error:
            print(error)
            return error
