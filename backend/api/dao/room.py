from api.util.config import db
from sqlalchemy import text


class Room(db.Model):
    __tablename__ = 'room'
    room_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(24), nullable=False)
    stock = db.Column(db.Integer, nullable=False)

    def __init__(self, **args):
        self.name = args.get('name')
        self.stock = args.get('stock')

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

    def create(pid):
        sql = text("Insert into room(name, stock) Values (:rname, :sid)")
        try:
            db.engine.execute(sql, {'rname': pid['room_name'],
                                    'sid': pid['stock']})
            return 'Success creating room'

        except Exception as error:
            print(error)
            return error

    @staticmethod
    def delete(pid):
        sql = text("DELETE FROM room WHERE name = :pid")
        try:
            db.engine.execute(sql, {'pid': pid['room_name']})
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
        sql = text("UPDATE room SET name = :new_name, stock = :pid WHERE name = :rname")
        try:
            db.engine.execute(sql, {'pid': pid['stock'],
                                    'rname': pid['room_name'],
                                    'new_name': pid['new_name']})
            return 'Success updating room'

        except Exception as error:
            print(error)
            return error

