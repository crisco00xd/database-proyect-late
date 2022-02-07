from api.util.config import db
from sqlalchemy import text


class UserVisit(db.Model):
    __tablename__ = 'uservisit'
    uservisit_id = db.Column(db.String(20), primary_key=True, nullable=False)
    visitor_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.appointment_id'), nullable=False)

    def __init__(self, **args):
        self.visitor_id = args.get('visitor_id')
        self.appointment_id = args.get('appointment_id')

    @property
    def pk(self):
        return self.visitor_id

    @staticmethod
    def getAllUserVisit():
        return UserVisit().query.all()

    @staticmethod
    def getUserVisit(visitor_id):
        sql = text("select tr.status,tr.comment,CONCAT(u.first_name,' ',u.last_name) as user_name, \
        tr.visit_date from public.UserVisit tr \
        left join public.users u \
        on u.appointment_id = tr.appointment_id \
        where tr.visitor_id = :visitor_id \
        order by visitor_id desc")
        return db.engine.execute(sql, {'visitor_id': visitor_id})

    @staticmethod
    def createVisit(Visit):
        sql = text("insert into public.UserVisit \
            (visitor_id,status,comment,appointment_id) \
            VALUES(:visitor_id, :status, :comment, :appointment_id)")
        try:
            db.engine.execute(sql, {'visitor_id': Visit['visitor_id'],
                                    'status': Visit['status'],
                                    'comment': Visit['comment'],
                                    'appointment_id': Visit['appointment_id']
                                    })
            return 'Successfully Created New Visit Visit'
        except:
            return 'Error Creating New Visit Visit'

    @staticmethod
    def getLatestVisit(visitor_id):
        sql = text("select tr.status,tr.comment,CONCAT(u.first_name,' ',u.last_name) as user_name, \
        tr.visit_date, tr.visitor_id \
         from public.UserVisit tr \
        left join public.users u \
        on u.appointment_id = tr.appointment_id \
        where tr.visitor_id = :visitor_id \
        order by visitor_id desc \
        LIMIT 1")
        return db.engine.execute(sql, {'visitor_id': visitor_id})

    @staticmethod
    def updateVisit(Visit):
        sql = text("UPDATE public.UserVisit \
            SET \
            visitor_id = :visitor_id \
            ,status = :status \
            ,comment = :comment \
            ,appointment_id = :appointment_id \
            ,visit_date = :visit_date \
            WHERE visitor_id = visitor_id")
        try:
            db.engine.execute(sql,
                              {'visitor_id': Visit['visitor_id'],
                               'status': Visit['status'],
                               'comment': Visit['comment'],
                               'appointment_id': Visit['appointment_id'],
                               'visit_date': Visit['visit_date'],
                               })
            return 'Successfully Edited Visit Visit'
        except:
            return 'Error Editing Visit Visit'

    @staticmethod
    def deleteVisit(visitor_id):
        sql = text("delete from public.UserVisit where visitor_id = :id ")
        try:
            db.engine.execute(sql, {'id': visitor_id})
            return 'Successfully Deleted Visit Visit'
        except:
            return 'Error Deleting Visit'
