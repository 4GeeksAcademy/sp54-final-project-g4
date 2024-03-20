"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random
import string
import bcrypt

from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from api.models import db, Users, Movies, Tags, Reviews, Playlists, Notifications, Followers, User_settings, Reports, Recommendations
from api.utils import generate_sitemap, APIException


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


def encrypt_password(password):
        password = password.encode('utf-8')
        salt = bcrypt.gensalt()
        password = bcrypt.hashpw(password, salt)
        password = password.decode('utf-8')
        return password


def user_referral_code():
    characters = string.ascii_letters + string.digits
    existing_codes = set(Users.query.with_entities(Users.referral_code).all())
    while True:
        new_code = ''.join(random.choices(characters, k=8))
        if new_code not in existing_codes:
            return new_code


def check_to_remove_tag(tag):
    if tag:
        return False
    return Return


def check_rating(rating):
    return max(0.0, min(rating, 5.0))


@api.route('/signup', methods=['POST']) 
def handle_signup():
    response_body = {}
    if request.method == 'POST':
        data = request.json
        referral_code = user_referral_code()
        email_lowercase = data['email'].lower() # Tratamos el email para no tener problemas con las mayúsculas.
        encrypted_password = encrypt_password(data['password']) # Encriptamos la contraseña y añadimos sal para evitar su desencriptacion.
        if data['referred_by'] == '': # Tratamos el dato de "Referred by" para que no de error en la base de datos en caso de ser vacio.
            data['referred_by'] = None
        user = Users(
                    username = data['username'],
                    email = email_lowercase,
                    password = encrypted_password,
                    credits = 0,
                    role = 'user',
                    referral_code = referral_code,
                    is_active = True,
                    referred_by = data['referred_by'])
        db.session.add(user)
        db.session.commit()
        response_body['message'] = f"User {data['username']} added."
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    if request.method == 'POST':
        username = request.json.get("username", None)
        email = request.json.get("email", None)
        if username:
            user = db.session.execute(db.select(Users).filter(Users.username.ilike(username))).scalar()
        elif email:
            email = email.lower() # Tratamos el email para no tener problemas con las mayúsculas.
            user = db.session.query(Users).filter_by(email=email, is_active=True).first()
        if user:
            password = request.json.get("password", None)
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                identity = {'username' : user.username,
                            'email' : user.email,
                            'id' : user.id,
                            'referral_code' : user.referral_code,
                            'referred_by' : user.referred_by}
                access_token = create_access_token(identity=identity)
                response_body["message"] = f"User {data['username']} logged correctly"
                response_body["access_token"] = access_token
                response_body["results"] = identity
                return response_body, 200
            response_body["message"] = "Incorrect password."
            return response_body, 401
        response_body["message"] = "User is not registered."
        return response_body, 401
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/users', methods=['GET'])
def handle_users():
    response_body = {}
    if request.method == 'GET':
        users =  db.session.execute(db.select(Users)).scalars()
        response_body['results'] = [row.serialize() for row in users]
        response_body['message'] = "User list obtained."
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/users/<string:username>', methods=['GET'])
def handle_user(username):
    response_body = {}
    if request.method == 'GET':
        user = db.session.execute(db.select(Users).filter(Users.username.ilike(username))).scalar()
        if user:
            response_body['results'] = user.serialize()
            response_body['message'] = f'{username} info obtained.'
            return response_body, 200
        response_body['message'] = f"{username} does not exist."
        return response_body, 404
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/movies", methods=['GET','POST'])
def handle_movies():
    response_body = {}
    if request.method == 'GET':
        movies = db.session.execute(db.select(Movies)).scalars()
        response_body['results'] = [row.serialize() for row in movies]
        response_body['message'] = "Movie list obtained"
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        movie = Movies(
                        title = data['title'],
                        release_date = data['released'],
                        genre = data['genre'],
                        director = data['director'],
                        trailer_url = data['trailer_url'],
                        cover = data['cover_url'],
                        sinopsis = data['sinopsis'],
                        is_active = True)
        db.session.add(movie)
        db.session.commit()
        response_body['message'] = f"{data['title']} successfully registered"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/movies/<int:movie_id>/addtag/<int:tag_id>", methods=['PATCH'])
def handle_add_tag_to_movie(movie_id, tag_id):
    response_body = {}
    if request.method == 'PATCH':
        movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
        tag = db.session.execute(db.select(Tags).where(Tags.id == tag_id)).scalar()
        movie.tags.append(tag)
        db.session.commit()
        response_body['message'] = f"Tag {tag_id} successfully added to {movie_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/movies/<int:movie_id>/deltag/<int:tag_id>", methods=['PATCH'])
def handle_remove_tag_to_movie(movie_id, tag_id):
    response_body = {}
    if request.method == 'PATCH':
        movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
        tag = db.session.execute(db.select(Tags).where(Tags.id == tag_id)).scalar()
        if tag in movie.tags:
            movie.tags.remove(tag)
            db.session.commit()
            response_body['message'] = f"Tag {tag_id} successfully removed from {movie_id}"
            return response_body, 200
        response_body['message'] = f"Tag {tag_id} not found in {movie_id}"
        return response_body, 404
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/tags", methods=['GET','POST'])
def handle_tags():
    response_body = {}
    if request.method == 'GET':
        tags = db.session.execute(db.select(Tags)).scalars()
        response_body['results'] = [row.serialize() for row in tags]
        response_body['message'] = "Tag list obtained"
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        tag = Tags(tag_name = data['tag'])
        db.session.add(tag)
        db.session.commit()
        response_body['message'] = f"{data['tag']} successfully registered"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/reviews/<int:user_id>/<int:movie_id>", methods=['GET','POST'])
def handle_review_user_and_movie_id(user_id, movie_id):
    response_body = {}
    if request.method == 'GET':
        review = db.session.execute(db.select(Reviews).where(Reviews.user_id == user_id and Reviews.movie_id == movie_id)).scalar()
        response_body['results'] = review.serialize()
        response_body['message'] = f"Review list from user {user_id}, movie {movie_id} obtained"
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        verified_rating = check_rating(data['rating'])
        review = Reviews(
                         rating = verified_rating,
                         review_text = data['review'],
                         user_id = user_id,
                         movie_id = movie_id,
                         is_active = True)
        db.session.add(review)
        db.session.commit()
        response_body['message'] = 'Review successfully registered'
        response_body['results'] = f"({data['review']}) added to user: {user_id} with rating {verified_rating}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/reviews/user/<int:user_id>", methods=['GET'])
def handle_review_user_id(user_id):
    response_body = {}
    if request.method == 'GET':
        reviews = db.session.execute(db.select(Reviews).where(Reviews.user_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in reviews]
        response_body['message'] = f'Review list from user {user_id} obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/reviews/movie/<int:movie_id>", methods=['GET'])
def handle_review_movie_id(movie_id):
    response_body = {}
    if request.method == 'GET':
        reviews = db.session.execute(db.select(Reviews).where(Reviews.movie_id == movie_id)).scalars()
        response_body['results'] = [row.serialize() for row in reviews]
        response_body['message'] = f'Review list from movie {movie_id} obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405



# Nos hemos quedado aqui <--------------------------------------------------------------------------------------------------
# Es decir, no corregir desde aqui

@api.route("/playlists/<int:user_id>", methods=['GET'])
def handle_playlists_user_all():
    response_body = {}
    if request.method == 'GET':
        playlists = db.session.execute(db.select(Playlists)).scalars()
        response_body['results'] = [row.serialize() for row in playlists]
        response_body['message'] = 'Playlists obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/playlists/<int:user_id>", methods=['GET'])
def handle_playlists_user_playlist():
    response_body = {}
    if request.method == 'GET':
        playlists = db.session.execute(db.select(Playlists)).scalars()
        response_body['results'] = [row.serialize() for row in playlists]
        response_body['message'] = 'Playlists obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/notifications/<int:user_id>", methods=['GET', 'POST'])
def handle_notifications(user_id):
    response_body = {}
    if request.method == 'GET':
        notifications = db.session.execute(db.select(Notifications).where(Notifications.user_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in notifications]
        response_body['message'] = 'Notifications obtained'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        notification = Notifications(
            notification_text = data['notification'],
            user_id = user_id)
        db.session.add(notification)
        db.session.commit()
        response_body['message'] = 'Notification successfully registered'
        response_body['results'] = f"({data['notification']}) added to user: {user_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/followers", methods=['GET'])
def handle_followers():
    response_body = {}
    if request.method == 'GET':
        followers = db.session.execute(db.select(Followers)).scalars()
        response_body['results'] = [row.serialize() for row in followers]
        response_body['message'] = 'Followers obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/settings", methods=['GET'])
def handle_user_settings():
    response_body = {}
    if request.method == 'GET':
        user_settings = db.session.execute(db.select(User_Settings)).scalars()
        response_body['results'] = [row.serialize() for row in user_settings]
        response_body['message'] = 'Settings obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/reports", methods=['GET'])
def handle_reports():
    response_body = {}
    if request.method == 'GET':
        reports = db.session.execute(db.select(Reports)).scalars()
        response_body['results'] = [row.serialize() for row in reports]
        response_body['message'] = 'Report list obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/recomendations", methods=['GET'])
def handle_recomendations():
    response_body = {}
    if request.method == 'GET':
        recomendations = db.session.execute(db.select(Recomendations)).scalars()
        response_body['results'] = [row.serialize() for row in recomendations]
        response_body['message'] = 'Recomendations obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405