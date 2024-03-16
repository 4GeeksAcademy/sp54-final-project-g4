"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import random
import string
import bcrypt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


def user_referral_code():
    characters = string.ascii_letters + string.digits
    existing_codes = set(Users.query.with_entities(Users.referral_code).all())
    while True:
        new_code = ''.join(random.choices(characters, k=8))
        if new_code not in existing_codes:
            return new_code


@api.route('/signup', methods=['POST']) 
def handle_signup():
    response_body = {}
    data = request.json
    referral_code = user_referral_code()
    if data['referred_by'] == '':
        data['referred_by'] = None
    data['email'] = data['email'].lower() #  Tratamos el email para no tener problemas con las mayúsculas.
    data['password'] = data['password'].encode('utf-8')
    salt = bcrypt.gensalt()
    data['password'] = bcrypt.hashpw(data['password'], salt)
    data['password'] = data['password'].decode('utf-8')
    user = Users(
        username = data['username'],
        email = data['email'],
        password = data['password'],
        credits = 0,
        role = 'user',
        referral_code = referral_code,
        is_active = True,
        referred_by = data['referred_by'])
    db.session.add(user)
    db.session.commit()
    response_body['message'] = 'User added'
    return response_body, 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    email = email.lower()
    password = request.json.get("password", None)
    print(password)
    user = db.session.query(Users).filter_by(email=email, is_active=True).first()
    if not user:
        response_body["msg"] = "User not register."
        return response_body, 401
    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        identity = {'username' : user.username,
                    'email' : user.email,
                    'id' : user.id,
                    'referral_code' : user.referral_code,
                    'referred_by' : user.referred_by}
        access_token = create_access_token(identity=identity)
        response_body["msg"] = "User logged correctly"
        return response_body, 200
    else:
        response_body["msg"] = "Incorrect password."
        return response_body, 40


@api.route('/users', methods=['GET'])
def handle_users():
    response_body = {}
    users =  db.session.execute(db.select(Users)).scalars()
    response_body['results'] = [row.serialize() for row in users]
    response_body['message'] = 'Users info obtained'
    return response_body, 200


@api.route('/users/<string:username>', methods=['GET'])
def handle_user(username):
    response_body = {}
    user = db.session.execute(db.select(Users).filter(Users.username.ilike(username))).scalar()
    if request.method == 'GET':
        response_body['results'] = user.serialize()
        response_body['message'] = f'{username} info obtained'
        return response_body, 200
    response_body['message'] = 'User not found'
    return response_body, 200


@api.route("/movies", methods=['GET'])
def handle_movies():
    pass