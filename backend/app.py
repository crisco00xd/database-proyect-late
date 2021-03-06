from flask import request
from api.dao import *
from api.util.config import app, db
from api.handler.room import RoomHandler
from api.handler.appointments import AppointmentsHandler
from api.handler.unavailabletimestamps import UnavailableTimestampsHandler
from api.handler.users import UsersHandler
from api.handler.userbusy import UserBusyHandler


@app.route('/', methods=['GET'])
def home():
    return "Hi"


@app.route('/make-busy-room', methods=['POST'])
def getSchedule():
    return UnavailableTimestampsHandler.makeTimeInRoomUnavailable(request.json)


@app.route('/create-meeting', methods=['POST'])
def createMeetingWithPeers():
    return AppointmentsHandler.createMeeting(request.json)



@app.route('/rooms-available-timeframe', methods=['POST'])
def getAllAvailableRoomsByTimeframe():
    if request.method == 'POST':
        return AppointmentsHandler.getAvailableRoomByTimeframe(request.json)


@app.route('/rooms/set-time-unavailable', methods=['GET'])
def setRoomBusy():
    return UnavailableTimestampsHandler.makeTimeInRoomUnavailable()


@app.route('/rooms-schedule', methods=['POST'])
def getRoomsSchedule():
    if request.method == 'POST':
        return AppointmentsHandler.getRoomSchedule(request.json)


@app.route('/unavailable-timestamps-all', methods=['GET'])
def getUnavailableTimestamps():
    if request.method == 'GET':
        return UnavailableTimestampsHandler.getAllUnavailableTimestamps()


@app.route('/rooms', methods=['GET', 'POST', 'PUT', 'DELETE'])
def getAllRoomOrCreate():
    if request.method == 'GET':
        return RoomHandler.getAllRoom()
    if request.method == 'PUT':
        return RoomHandler.updateRoom(request.json)
    if request.method == 'DELETE':
        return RoomHandler.deleteRoom(request.json)
    else:
        return RoomHandler.createRoom(request.json)


@app.route('/rooms/room-by-name', methods=['POST'])
def getRoomByName():
    return RoomHandler.getroomByName(request.json)


@app.route('/rooms/room-by-id', methods=['POST'])
def getRoomById():
    return RoomHandler.getRoomById(request.json)


@app.route('/Appointments', methods=['GET', 'POST'])
def getAllAppointmentsOrCreate():
    if request.method == 'GET':
        return AppointmentsHandler.getAllAppointments()
    else:
        return AppointmentsHandler.createMeeting(request.json)


@app.route('/Appointments/<int:rid>', methods=['GET', 'PUT', 'DELETE'])
def getAppointmentByIdOrEdit(rid):
    if request.method == 'GET':
        return AppointmentsHandler.getAppointmentById(rid)
    elif request.method == 'DELETE':
        return AppointmentsHandler.cancelAppointment(rid)


@app.route('/Appointments/delete-meeting', methods=['POST'])
def deleteAppointment():
    return AppointmentsHandler.deleteAppointment(request.json)


@app.route('/Appointments/delete-unavailable', methods=['POST'])
def deleteUnavailableTimestamp():
    return UnavailableTimestampsHandler.deleteUnavailableTimestamps(request.json)

@app.route('/delete-room-busy', methods=['POST'])
def deleteRoomBusy():
    return UnavailableTimestampsHandler.deleteBusyRoom(request.json)


@app.route('/Appointments/get-meeting', methods=['POST'])
def getAppointmentsByUser():
    return AppointmentsHandler.getAppointmentsByRoomAndTime(request.json)


@app.route('/Appointments/update-meeting', methods=['POST'])
def updateMeeting():
    return AppointmentsHandler.updateAppointment(request.json)


@app.route('/Appointments/room/get-owner-by-timeframe', methods=['POST'])
def getOwnerByTime():
    return AppointmentsHandler.getWhoAppointedRoomByTime(request.json)


@app.route('/users', methods=['GET'])
def getAllUsers():
    return UsersHandler.getAllUsers()


@app.route('/delete-user', methods=['DELETE'])
def deleteUsers():
    return UsersHandler.deleteUser(request.json)


@app.route('/user/get-user-by-id', methods=['POST'])
def getUserById():
    return UsersHandler.getUserById(request.json)


@app.route('/user/get-user-by-email', methods=['POST'])
def getUserByemail():
    return UsersHandler.getUserByEmail(request.json)


@app.route('/login', methods=['POST'])
def login():
    return UsersHandler.login(request.json)


@app.route('/logout', methods=['GET'])
def logout():
    return UsersHandler.logout()


@app.route('/create-user', methods=['POST'])
def createUser():
    return UsersHandler.createUser(request.get_json())


@app.route('/update-user', methods=['PUT'])
def updateUser():
    print(request.json)
    return UsersHandler.updateUser(request.json)


@app.route('/delete-user/<string:user_id>', methods=['DELETE'])
def deleteUser(user_id):
    return UsersHandler.deleteUser(user_id)


@app.route('/user-schedule', methods=['POST'])
def getUserSchedule():
    return UsersHandler.getUserSchedule(request.json)


@app.route('/statistics/used-room', methods=['POST'])
def getMostUsedRoom():
    return UnavailableTimestampsHandler.findMostUsedRoom(request.json)


@app.route('/statistics/busy-hours', methods=['POST'])
def getBusyHour():
    return UnavailableTimestampsHandler.findBusiestHours(request.json)


@app.route('/statistics/busy-users', methods=['POST'])
def getMostBusyUser():
    return UnavailableTimestampsHandler.findMostBookedUsers(request.json)


@app.route('/statistics/busy-rooms', methods=['POST'])
def getBusyRoom():
    return UnavailableTimestampsHandler.findMostBookedRoom(request.json)


@app.route('/statistics/user-most-booked-user', methods=['POST'])
def getMostBookedUser():
    return UnavailableTimestampsHandler.UserMostBookedUser(request.json)


@app.route('/statistics/most-booked-room-by-user', methods=['POST'])
def getMostBookedRoomByUser():
    return UnavailableTimestampsHandler.MostBookedRoomByUser(request.json)


@app.route('/userbusy/create-user-busy', methods=['POST'])
def createUserBusy():
    return UserBusyHandler.createUserBusy(request.json)


@app.route('/userbusy/user-busy-update', methods=['POST'])
def updateUserBusy():
    return UserBusyHandler.updateUserBusy(request.json)


@app.route('/userbusy/user-busy-delete', methods=['POST'])
def deleteUserBusy():
    return UserBusyHandler.deleteUserBusy(request.json)


@app.route('/userbusy/user-busy-get', methods=['POST'])
def getUserBusy():
    return UserBusyHandler.getUserBusy(request.json)


if __name__ == '__main__':
    db.create_all()
    db.session.commit()
    app.run(debug=True)
    app.run()
