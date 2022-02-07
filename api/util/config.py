import flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

DEV_DB = 'postgresql://postgres:kali@localhost/postgres'
PROD_DB = 'postgresql://vworkrggjkdshc:8aecc96bfffa34f0a7319fd255f5b425c5d851f9d15bd161c07d6305b67d7c41@ec2-52-87-123-108.compute-1.amazonaws.com:5432/dajfdiih6spg04'

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = PROD_DB
app.secret_key = 'password'

db: SQLAlchemy = SQLAlchemy(app)
CORS(app)
