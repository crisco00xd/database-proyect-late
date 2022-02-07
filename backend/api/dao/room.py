from api.util.config import db
from sqlalchemy import text


class Room(db.Model):
    __tablename__ = 'room'
    room_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(24), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    dept_id = db.Column(db.Integer, db.ForeignKey('departments.dept_id'), nullable=False)

    def __init__(self, **args):
        self.name = args.get('name')
        self.stock = args.get('stock')
        self.dept_id = args.get('dept_id')

    @property
    def pk(self):
        return self.room_id

    # TODO FIX NON RELATIONAL QUERIES

    @staticmethod
    def getRoom():
        sql = text("Select * from room")
        try:
            return db.engine.execute(sql)

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getRoomById(rid):
        sql = text("Select * from room Where room_id = :rid")
        try:
            return db.engine.execute(sql, {'rid': rid['room_id']})

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def getroomByName(rid):
        sql = text("Select * from room Where name = :rid")
        try:
            return db.engine.execute(sql, {'rid': rid['room_name']})

        except Exception as error:
            print(error)
            return error
     
    @staticmethod
    def getRoomByDepartment(did):
        sql = text("Select * from room Where dept_id = :did")
        try:
            return db.engine.execute(sql, {'did': did['dept_id']})

        except Exception as error:
            print(error)
            return error

    def create(pid):
        sql = text("Insert into room(name, stock, dept_id) Values (:rname, :sid, :did)")
        try:
            db.engine.execute(sql, {'rname': pid['room_name'],
                                    'sid': pid['stock'],
                                    'did': pid['dept_id']})
            return 'Success creating room'

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def delete(pid):
        sql = text("DELETE FROM room WHERE room_id = :pid")
        try:
            db.engine.execute(sql, {'pid': pid['room_id']})
            return 'Success deleting room'

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def updateStock(pid):
        sql = text("UPDATE room SET stock = :pid WHERE room_id = :rid")
        try:
            db.engine.execute(sql, {'rid': pid['room_id'],
                                    'pid': pid['stock']})
            return 'Success updating room'

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def updateRoom(pid):
        sql = text("UPDATE room SET room_id = :rid, name = :rname, dept_id = :did, stock = :pid WHERE room_id = :rid")
        try:
            db.engine.execute(sql, {'rid': pid['room_id'],
                                    'pid': pid['stock'],
                                    'rname': pid['room_name'],
                                    'did': pid['dept_id']})
            return 'Success updating room'

        except Exception as error:
            print(error)
            return error

