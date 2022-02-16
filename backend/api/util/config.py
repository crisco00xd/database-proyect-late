import flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

DEV_DB = 'postgresql://postgres:kali@localhost/postgres'
PROD_DB = 'postgresql://lmnbpmmsfewtmd:f00ecedd12170e934d3ff81e4971b5bd6ca39cad9f15b4c9afab86a5bab44ceb@ec2-35-175-68-90.compute-1.amazonaws.com:5432/d6attkqqu1c238'

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = PROD_DB
app.secret_key = 'password'

db: SQLAlchemy = SQLAlchemy(app)
CORS(app)
