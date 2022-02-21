from flask import jsonify
from api.dao.appointments import Appointments
from api.util.utilities import Utilities


class AppointmentsHandler:

    @staticmethod
    def getAllAppointments():
        try:
            Appointment = Appointments.getAppointments()
            result_list = []
            for Appointment in Appointments:
                result_list.append(Utilities.to_dict(Appointment))
            result = {
                "message": "Success!",
                "Appointments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getAppointmentById(rid):
        try:
            Appointment = Appointments.getAppointmentById(rid)
            Appointment_dict = Utilities.to_dict(Appointment)
            result = {
                "message": "Success!",
                "Appointment": Appointment_dict
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getAppointmentDictById(rid):
        try:
            Appointment = Appointments.getAppointmentById(rid)
            Appointment_dict = Utilities.to_dict(Appointment)
            return Appointment_dict
        except Exception as e:
            return None

    @staticmethod
    def getUnfulfilledAppointments():
        try:
            Appointment = Appointments.getUnfulfilledAppointments()
            result_list = []
            for Appointment in Appointments:
                result_list.append(Utilities.to_dict(Appointment))
            result = {
                "message": "Success!",
                "Appointments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getAllAppointmentsByDeroomment(did):
        try:
            Appointment = Appointments.getAllAppointmentsByDeroomment(did)
            result_list = []
            for Appoint in Appointments:
                result_list.append(Utilities.raw_sql_to_dict(Appoint))
            result = {
                "message": "Success!",
                "Appointments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getUnfulfilledAppointmentsByDeroomment(did):
        try:
            Appointment = Appointments.getUnfulfilledAppointmentsByDeroomment(did)
            result_list = []
            for appoint in Appointment:
                result_list.append(Utilities.to_dict(appoint))
            result = {
                "message": "Success!",
                "Appointments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getWhoAppointedRoomByTime(did):
        try:
            Appointment = Appointments.getWhoAppointedRoomByTime(did)
            print(Appointment)
            d, a = {}, []
            for rowproxy in Appointment:
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
    def getRoomSchedule(did):
        try:
            Appointment = Appointments.getRoomSchedule(did)
            d, a = {}, []
            for rowproxy in Appointment:
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
    def getAvailableRoomByTime(did):
        try:
            Appointment = Appointments.getAvailableRoomByTime(did)
            d, a = {}, []
            for rowproxy in Appointment:
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
    def getAvailableRoomByTimeframe(did):
        try:
            Appointment = Appointments.getAvailableRoomByTimeframe(did)
            d, a = {}, []
            for rowproxy in Appointment:
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
    def getAppointmentsHistoryByDeroomment(did):
        try:
            Appointment = Appointments.getAppointmentsHistoryByDeroomment(did)
            result_list = []
            for Appointment in Appointments:
                result_list.append(Utilities.to_dict(Appointment))
            result = {
                "Appointments": result_list
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def getAppointmentsByRoomAndTime(uid):
        try:
            Appointment = Appointments.getAppointmentByRoomAndTime(uid)
            d, a = {}, []
            for rowproxy in Appointment:
                for column, value in rowproxy.items():
                    # build up the dictionary
                    d = {**d, **{column: value}}
                a.append(d)
            result = {
                "Appointments": a
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def createAppointment(json):

        valid_parameters = Utilities.verify_parameters(json, ['stock', 'appointment_id', 'room_id', 'owner_id',
                                                              'date_reserved', 'date_end', 'rank_id', 'status'])
        if valid_parameters:
            try:
                newAppointment = Appointments(**valid_parameters).create()
                result = {
                    "message": "Success!",
                    "Appointment": Utilities.to_dict(newAppointment)
                }
                return jsonify(result), 200
            except Exception as e:
                return jsonify(reason="Server error", error=e.__str__()), 500
        else:
            return jsonify(reason="Invalid parameters"), 400

    @staticmethod
    def createMeeting(json):
        valid_parameters = Utilities.verify_parameters(json, ['stock', 'appointment_id', 'room_id', 'owner_id',
                                                              'date_reserved', 'date_end', 'rank_id', 'status',
                                                              'members', 'total_members'])
        if valid_parameters:
            try:
                newAppointment = Appointments(**valid_parameters).createMeeting(json)
                result = {
                    "message": "Success!",
                    "Appointment": newAppointment
                }
                return jsonify(result), 200
            except Exception as e:
                return jsonify(reason="Server error", error=e.__str__()), 500
        else:
            return jsonify(reason="Invalid parameters"), 400

    @staticmethod
    def updateAppointment(rid):
        try:
            updatedAppointment = Appointments.updateAppointment(rid)
            result = {
                "message": "Success!",
                "room": updatedAppointment
            }
            return jsonify(result), 200
        except Exception as e:
            return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def cancelAppointment(rid):
        updatedAppointment = Appointments.cancelAppointment(rid)
        result = {
            "message": "Success!",
            "room": Utilities.to_dict(updatedAppointment)
        }
        return jsonify(result), 200

    @staticmethod
    def deleteAppointment(rid):
        deletedAppointment = Appointments.deleteAppointment(rid)
        result = {
            "message": "Success!",
            "Appointment": Utilities.to_dict(deletedAppointment)
        }
        return jsonify(result), 200

    @staticmethod
    def updateStatus(rid, json):
        valid_parameters = Utilities.verify_parameters(json, ['fulfiller_id', 'status_id'])
        if valid_parameters:
            try:
                updatedAppointment = Appointments.updateStatus(rid, **valid_parameters)
                result = {
                    "message": "Success!",
                    "room": Utilities.to_dict(updatedAppointment)
                }
                return jsonify(result), 200
            except Exception as e:
                print(e)
                return jsonify(reason="Server error", error=e.__str__()), 500

    @staticmethod
    def addAmountUsed(rid, json):
        valid_parameters = Utilities.verify_parameters(json, ['amount_used'])
        if valid_parameters:
            try:
                updatedAppointment = Appointments.addAmountUsed(rid, json['amount_used'])
                result = {
                    "message": "Success!",
                    "room": Utilities.to_dict(updatedAppointment)
                }
                return jsonify(result), 200
            except Exception as e:
                return jsonify(reason="Server error", error=e.__str__()), 500
