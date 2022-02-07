from api.util.config import db


class Departments(db.Model):
    __tablename__ = 'departments'
    dept_id = db.Column(db.Integer, primary_key=True)
    dept_name = db.Column(db.String(16), nullable=False)

    def __init__(self, **args):
        self.dept_name = args.get('dept_name')

    def __repr___(self):
        return self.dept_name

    @property
    def pk(self):
        return self.dept_id

    # TODO FIX NON RELATIONAL QUERIES

    @staticmethod
    def getDepartments():
        return Departments().query.all()

    @staticmethod
    def getDepartmentById(department_id):
        return Departments().query.filter_by(dept_id=department_id).first()
