"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random
import string
import bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint, current_app as app
from flask import render_template

from flask_cors import CORS
from flask_jwt_extended import (get_jwt, jwt_required, create_access_token, get_jwt_identity)
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

from api.models import db, Users, Movies, Tags, Reviews, Playlists, Notifications, Followers, User_settings, Reports, Recommendations
from api.utils import generate_sitemap, APIException

# API Config
api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# Auxiliar functions
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


""" def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    app.extensions['mail'].send(msg) """



def check_rating(rating):
    return max(0.0, min(rating, 5.0))


@api.route('/signup', methods=['POST']) 
def handle_signup():
    response_body = {}
    if request.method == 'POST':
        data = request.json
        required_data = ['username','email','password']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        user = db.session.execute(db.select(Users).filter(Users.username.ilike(data.get('username')))).scalar()
        if user:
            response_body['message'] = f"User already exists"
            return response_body, 401
        referral_code = user_referral_code()
        email_lowercase = data.get('email').lower() # Tratamos el email para no tener problemas con las mayúsculas.
        encrypted_password = encrypt_password(data.get('password')) # Encriptamos la contraseña y añadimos sal para evitar su desencriptacion.
        reffered_by = data.get('referred_by', None) # Tratamos el dato de "Referred by" para que no de error en la base de datos en caso de ser vacio.
        user = Users(username = data.get('username'),
                     email = email_lowercase,
                     password = encrypted_password,
                     credits = 0,
                     role = 'user',
                     referral_code = referral_code,
                     is_active = True,  # El usuario está inactivo hasta que confirme su correo electrónico
                     referred_by = reffered_by)
        db.session.add(user)
        db.session.commit()
        user_info = db.session.execute(db.select(Users).filter(Users.username.ilike(data.get('username')))).scalar()
        defaultSetting = User_settings(user_id = user_info.id,
                                       setting_name = 'privacy',
                                       setting_value = 'public')
        defaultPlaylist = Playlists(name = 'Watchlist',
                                    user_id = user_info.id)
        db.session.add(defaultSetting)
        db.session.add(defaultPlaylist)
        db.session.commit()

        """ # Enviar correo electrónico de confirmación
        safeTime = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])
        token = safeTime.dumps(user.email, salt='email-confirm')
        confirm_url = url_for('confirm_email', token=token, _external=True)
        html = render_template('confirm_email.html', confirm_url=confirm_url)
        subject = "Star trail - Confirm email"
        send_email(user.email, subject, html) """

        response_body['message'] = f"User {data.get('username')} added. Please confirm your email."
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    if request.method == 'POST':
        data = request.json
        username = data.get('username', None)
        email = data.get('email', None)
        if username:
            user = db.session.execute(db.select(Users).filter(Users.username.ilike(username))).scalar()
        if email:
            email_lowercase = email.lower() # Tratamos el email para no tener problemas con las mayúsculas.
            user = db.session.execute(db.select(Users).filter(Users.email.ilike(email_lowercase))).scalar()
        if not user:
            response_body["message"] = f"User is not registered."
            return response_body, 404
        if not user.is_active:
            response_body["message"] = "Account is inactive"
            return response_body, 404
        password = request.json.get("password", None)
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            access_token = create_access_token(identity=user.serialize_public())
            response_body["message"] = f"User logged correctly"
            response_body["access_token"] = access_token
            response_body["results"] = user.serialize_public()
            return response_body, 200
        response_body["message"] = "Incorrect password."
        return response_body, 401
    response_body['message'] = "Method not allowed."
    return response_body, 405

@api.route("/check-password", methods=["POST"])
@jwt_required()
def check_password():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'POST':
        password = request.json.get("password", None)
        user = db.session.execute(db.select(Users).filter(Users.username.ilike(current_user['username']))).scalar()
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            response_body["message"] = f"Password is correct"
            response_body["results"] = {'correct':True}
            return response_body, 200
        response_body["message"] = "Incorrect password."
        response_body["results"] = {'correct':False}
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405

@api.route("/check-current-user", methods=["GET"])
@jwt_required()
def check_current_user():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        response_body['message'] = f"El usuario es: {current_user['username']}"
        response_body['results'] = current_user
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/users', methods=['GET'])
@jwt_required(optional=True)
def handle_users():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        user_list =  db.session.execute(db.select(Users)).scalars()
        current_user_db_info = db.session.execute(db.select(Users).filter(Users.username.ilike(current_user['username']))).scalar().serialize()
        response_body['results'] = [row.serialize() for row in user_list] if current_user and current_user_db_info['role'] == 'admin' else [row.serialize_public() for row in user_list]
        response_body['message'] = "User list obtained."
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/users/<string:username>', methods=['GET', 'PUT'])
@jwt_required(optional=True)
def handle_users_info(username):
    response_body = {}
    current_user = get_jwt_identity()
    user = db.session.execute(db.select(Users).filter(Users.username.ilike(username))).scalar()
    if not user:
        response_body['message'] = f"{username} not found."
        return response_body, 404

    if request.method == 'GET':
        response_body['results'] = user.serialize() if current_user and (current_user['username'] == user.username or current_user['role'] == 'admin') else user.serialize_public()
        response_body['message'] = f"{username} obtained."
        return response_body, 200
        
    if request.method == 'PUT':
        if current_user:
            data = request.json
            allowed_attributes = {'username': True,
                                  'password': True,
                                  'email': True,
                                  'bio': True,
                                  'credits': current_user['role'] == 'admin',
                                  'role': current_user['role'] == 'admin',
                                  'is_active': True}
            if not (current_user['username'] == user.username) and not (current_user['role'] == 'admin'):
                response_body['message'] = f"You have no permissions to do that!"
                return response_body, 401

            for key, value in data.items():
                if hasattr(user, key) and allowed_attributes.get(key, False):
                    if key == 'password':
                        value = encrypt_password(value)
                    setattr(user, key, value)
            db.session.commit()
            response_body['message'] = f"{username} updated"
            return response_body, 200
        response_body['message'] = "Token is required to edit user's info"
        return response_body, 401
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/users/id/<int:user_id>', methods=['GET'])
@jwt_required(optional=True)
def handle_users_id_info(user_id):
    response_body = {}
    current_user = get_jwt_identity()
    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not user:
        response_body['message'] = f"{user_id} not found."
        return response_body, 200

    if request.method == 'GET':
        response_body['results'] = user.serialize() if current_user and (current_user['id'] == user.id or current_user['role'] == 'admin') else user.serialize_public()
        response_body['message'] = f"{user_id} obtained."
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/movies", methods=['GET','POST'])
@jwt_required(optional=True)
def handle_movies():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        movies = db.session.execute(db.select(Movies)).scalars()
        response_body['results'] = [row.serialize() for row in movies]
        response_body['message'] = "Movie list obtained"
        return response_body, 200

    if request.method == 'POST':
        if current_user:
            data = request.json
            required_data = ['title']
            for key in required_data:
                if key not in data:
                    response_body = {'message': f"Falta {key} en el body"}
                    return response_body, 400
            movie = Movies( title = data.get('title'),
                            release_date = data.get('release_date', None),
                            genre = data.get('genre', None),
                            director = data.get('director', None),
                            trailer_url = data.get('trailer_url', None),
                            cover_url = data.get('cover_url', None),
                            sinopsis = data.get('sinopsis', None),
                            is_active = True)
            db.session.add(movie)
            db.session.commit()
            response_body['message'] = f"{data.get('title')} successfully registered"
            return response_body, 200
        response_body['message'] = "Token is required to add a movie"
        return response_body, 404
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route('/movies/<int:movie_id>', methods=['GET', 'PUT'])
@jwt_required(optional=True)
def handle_movie(movie_id):
    response_body = {}
    movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
    current_user = get_jwt_identity()
    if not movie:
        response_body['message'] = f"Movie {movie_id} not found"
        return response_body, 404

    if request.method == 'GET':
        response_body['results'] = movie.serialize()
        response_body['message'] = f"Movie information obtained"
        return response_body, 200

    if request.method == 'PUT':
        if current_user['role'] != 'admin':
            response_body['message'] = "Only admins can edit movies."
            return response_body, 401
        data = request.json
        allowed_attributes = {  'title': True,
                                'release_date': True,
                                'genre': True,
                                'director': True,
                                'trailer_url': True,
                                'cover_url': True,
                                'sinopsis': True,
                                'is_active': True}
        for key, value in data.items():
            if hasattr(movie, key) and allowed_attributes.get(key, False):
                setattr(movie, key, value)
        db.session.commit()
        response_body['message'] = f"Movie updated"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/movies/<int:movie_id>/managetags/<int:tag_id>", methods=['POST', 'DELETE'])
@jwt_required()
def handle_manage_tags(movie_id, tag_id):
    response_body = {}
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        response_body['message'] = "Only admins can edit movies."
        return response_body, 401
        
    if request.method == 'POST':
        movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
        tag = db.session.execute(db.select(Tags).where(Tags.id == tag_id)).scalar()
        movie.tags.append(tag)
        db.session.commit()
        response_body['message'] = f"Tag {tag_id} successfully added to {movie_id}"
        return response_body, 200

    if request.method == 'DELETE':
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
@jwt_required(optional=True)
def handle_tags():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        tags = db.session.execute(db.select(Tags)).scalars()
        response_body['results'] = [row.serialize() for row in tags]
        response_body['message'] = "Tag list obtained"
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        if current_user['role'] != 'admin':
            response_body['message'] = "Only admins can add tags."
            return response_body, 401
        required_data = ['tag']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        tag = Tags(tag_name = data.get('tag'))
        db.session.add(tag)
        db.session.commit()
        response_body['message'] = f"{data.get('tag')} successfully registered"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/tags/<int:tag_id>", methods=['PUT'])
@jwt_required(optional=True)
def handle_edit_tag(tag_id):
    response_body = {}
    current_user = get_jwt_identity()
    tag = db.session.execute(db.select(Tags).where(Tags.id == tag_id)).scalar()
    if current_user['role'] != 'admin':
        response_body['message'] = "Only admins can add tags."
        return response_body, 401
    if request.method == 'PUT':
        data = request.json
        allowed_attributes = {'tag_name':True}
        for key, value in data.items():
            if hasattr(tag, key) and allowed_attributes.get(key, False):
                setattr(tag, key, value)
        db.session.commit()
        response_body['message'] = f"Tag updated"
        return response_body, 200


@api.route("/reviews/<int:movie_id>/<int:user_id>", methods=['GET', 'POST', 'PUT'])
@jwt_required()
def handle_review_movie_user(movie_id, user_id):
    response_body = {}
    current_user = get_jwt_identity()
    review = db.session.execute(db.select(Reviews).where(Reviews.user_id == user_id, Reviews.movie_id == movie_id)).scalar()
    if request.method == 'GET':
        if review:
            response_body['message'] = f"Review found"
            response_body['results'] = review.serialize()
            return response_body, 200
        response_body['message'] = f"Review not found"
        return response_body, 404

    if request.method == 'POST':
        data = request.json
        if review:
            response_body['message'] = f"Review already exist"
            return response_body, 401
        required_data = ['rating', 'review_text']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        verified_rating = check_rating(data['rating'])
        review = Reviews(
                         rating = verified_rating,
                         review_text = data['review_text'],
                         user_id = user_id,
                         movie_id = movie_id,
                         is_active = True)
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        user.credits = user.credits + 5
        followers = db.session.execute(db.select(Followers).where(Followers.following_id == user_id))
        for follower in followers:
            follower_id = follower[0].follower_id
            notification = Notifications(notification_text = f"{user_id} ha publicado una review!", user_id = follower_id)
            db.session.add(notification)
        db.session.add(review)
        db.session.commit()
        response_body['message'] = f"Review added to user: {user_id} with rating {verified_rating}"
        response_body['results'] = f"{data['review_text']}"
        return response_body, 200

    if request.method == 'PUT':
        data = request.json
        allowed_attributes = {  'rating': True,
                                'review_text': True,
                                'is_active': True}
        if not (current_user['id'] == review.user_id) and not (current_user['role'] == 'admin'):
            response_body['message'] = f"You have no permissions to do that!"
            return response_body, 401
        for key, value in data.items():
            if hasattr(review, key) and allowed_attributes.get(key, False):
                setattr(review, key, value)
        db.session.commit()
        response_body['message'] = f"Review updated"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/playlists/<int:user_id>", methods=['GET','POST', 'PUT', 'DELETE'])
@jwt_required(optional=True)
def handle_playlists_user_all(user_id):
    response_body = {}
    if request.method == 'GET':
        playlists = db.session.execute(db.select(Playlists).where(Playlists.user_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in playlists]
        response_body['message'] = 'Playlists obtained'
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        playlist = db.session.execute(db.select(Playlists).where(Playlists.user_id == user_id, Playlists.name == data.get('name'))).scalar()
        if playlist:
            response_body['message'] = f"Playlist already exist"
            response_body['results'] = playlist.serialize()
            return response_body, 401
        required_data = ['name']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        playlist = Playlists(name = data['name'],
                             user_id = user_id)
        db.session.add(playlist)
        db.session.commit()
        response_body['message'] = f"Playlist {data.get('name')} added"
        return response_body, 200

    # Estos dos Endpoints, el PUT y el DELETE estan pegados con cola blanca para el deploy, es una chapuza, lo se
    # Por no hacer, no comprueba ni quien borra el endpoint, vamos, una chapuza.
    if request.method == 'PUT':
        data = request.json
        playlist = db.session.execute(db.select(Playlists).where(Playlists.user_id == user_id, Playlists.name == data.get('name'))).scalar()
        if not playlist:
            response_body['message'] = f"Playlist does not exist"
            return response_body, 404
        if playlist.name == "Watchlist":
            response_body['message'] = f"Cannot edit this playlist!"
            return response_body, 403
        required_data = ['name', 'new_name']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        allowed_attributes = {'name': True}
        for key, value in data.items():
            if hasattr(playlist, key) and allowed_attributes.get(key, False):
                if key == 'name':
                    value = data['new_name']
                setattr(playlist, key, value)
        db.session.commit()
        response_body['message'] = f"Playlist {data['name']} successfully updated to {data['new_name']}"
        return response_body, 200

    if request.method == 'DELETE':
        data = request.json
        playlist = db.session.execute(db.select(Playlists).where(Playlists.user_id == user_id, Playlists.name == data.get('name'))).scalar()
        if not playlist:
            response_body['message'] = f"Playlist does not exist"
            return response_body, 404
        if playlist.name == "Watchlist":
            response_body['message'] = f"Cannot delete this playlist!"
            return response_body, 403
        db.session.delete(playlist)
        db.session.commit()
        response_body['message'] = f"Playlist {playlist.name} successfully deleted"
        return response_body, 200



@api.route("/playlists/<int:playlist_id>/managemovies/<int:movie_id>", methods=['POST', 'DELETE'])
@jwt_required()
def handle_manage_movies_in_playlist(playlist_id, movie_id):
    response_body = {}
    current_user = get_jwt_identity()
    playlist = db.session.execute(db.select(Playlists).where(Playlists.id == playlist_id)).scalar()
    if not (current_user['id'] == playlist.user_id) and not (current_user['role'] == 'admin'):
        response_body['message'] = f"You have no permissions to do that!"
        return response_body, 401

    movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
    if request.method == 'POST':
        if not (movie in playlist.movies):
            playlist.movies.append(movie)
            db.session.commit()
            response_body['message'] = f"Movie {movie_id} successfully added to {playlist_id}"
            return response_body, 200
        response_body['message'] = f"Movie {movie_id} is already in {playlist_id}"
        return response_body, 400

    if request.method == 'DELETE':
        if movie in playlist.movies:
            playlist.movies.remove(movie)
            db.session.commit()
            response_body['message'] = f"Movie {movie_id} successfully removed from {playlist_id}"
            return response_body, 200
        response_body['message'] = f"Movie {movie_id} not found in {playlist_id}"
        return response_body, 404
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/notifications/<int:user_id>", methods=['GET','POST'])
@jwt_required()
def handle_get_notifications(user_id):
    response_body = {}
    current_user = get_jwt_identity()
    if not (current_user['id'] == user_id) and not (current_user['role'] == 'admin'):
        response_body['message'] = f"You have no permissions to do that!"
        return response_body, 401

    if request.method == 'GET':
        notifications = db.session.execute(db.select(Notifications).where(Notifications.user_id == user_id)).scalars()
        if not notifications:
            response_body['message'] = "No notifications found."
            return response_body, 404
        response_body['results'] = [row.serialize() for row in notifications_query_result]
        response_body['message'] = 'Notifications obtained'
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        required_data = ['notification_text']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        if not (current_user['role'] == 'admin'):
            response_body['message'] = f"You have no permissions to do that!"
            return response_body, 401
        new_notification = Notifications(notification_text = data['notification_text'], user_id = user_id)
        db.session.add(new_notification)
        db.session.commit()
        response_body['message'] = f"Notification successfully added"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/notifications/<int:user_id>/<notification_id>", methods=['DELETE'])
@jwt_required()
def handle_manage_notifications(user_id, notification_id):
    response_body = {}
    current_user = get_jwt_identity()
    if not (current_user['id'] == user_id) and not (current_user['role'] == 'admin'):
        response_body['message'] = f"You have no permissions to do that!"
        return response_body, 401

    notification = db.session.execute(db.select(Notifications).where(Notifications.user_id == user_id, Notifications.id == notification_id)).scalar()
    if not notification:
        response_body['message'] = f"Notification not found"
        return response_body, 404

    if request.method == 'DELETE':
        db.session.delete(notification)
        db.session.commit()
        response_body['message'] = f"Notification successfully deleted"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/managefollows/<int:follower_id>/<int:following_id>", methods=['POST', 'DELETE'])
@jwt_required()
# Follower = Quien sigue
# Following = A quien sigues
def handle_manage_follows(follower_id, following_id):
    response_body = {}
    current_user = get_jwt_identity()
    user = db.session.execute(db.select(Users).where(Users.id == current_user['id'])).scalar()
    if not (current_user['id'] == follower_id) or (current_user['role'] == 'admin'):
        response_body['message'] = f"You have no permissions to do that!"
        return response_body, 401
    follower = db.session.execute(db.select(Users).where(Users.id == follower_id)).scalar()
    if not follower:
        response_body['message'] = f"The 'follower' user doesn't exist!"
        return response_body, 404
    following = db.session.execute(db.select(Users).where(Users.id == following_id)).scalar()
    if not following:
        response_body['message'] = f"The 'following' user doesn't exist!"
        return response_body, 404

    if request.method == 'POST':
        follower_exist = db.session.execute(db.select(Followers).where(Followers.follower_id == follower_id, Followers.following_id == following_id)).scalar()
        if follower_exist:
            response_body['message'] = f"The 'follower' user already follows 'following' user!"
            return response_body, 200
        follows = Followers(follower_id = follower_id, following_id = following_id)
        notification = Notifications(notification_text = f"{follower.username} te sigue!", user_id = following_id)
        db.session.add(notification)
        db.session.add(follows)
        db.session.commit()
        response_body['message'] = f"{follower_id} is now following {following_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        follows = db.session.execute(db.select(Followers).where(Followers.follower_id == follower_id, Followers.following_id == following_id)).scalar()
        db.session.delete(follows)
        db.session.commit()
        response_body['message'] = f"{follower_id} is now not following {following_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/settings/<int:user_id>/<string:setting_name>", methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def handle_user_settings(user_id, setting_name):
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'POST':
        if not (current_user['role'] == 'admin'):
            response_body['message'] = f"Only administrators can add settings, nice try tho..."
            return response_body, 401
        setting = db.session.execute(db.select(User_settings).filter(User_settings.setting_name.ilike(setting_name))).scalar()
        if setting:
            response_body['message'] = f"Setting already exists, cannot create"
            return response_body, 400
        data = request.json
        required_data = ['setting_value']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        setting = User_settings(user_id = user_id,
                                setting_name = setting_name,
                                setting_value = data['setting_value'])
        db.session.add(setting)
        db.session.commit()
        response_body['message'] = f"Setting added to user: {user_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        if not (current_user['role'] == 'admin'):
            response_body['message'] = f"Only administrators can remove settings, nice try tho..."
            return response_body, 401
        setting = db.session.execute(db.select(User_settings).filter(User_settings.setting_name.ilike(setting_name))).scalar()
        if not setting:
            response_body['message'] = f"Setting doesn't exist"
            return response_body, 400
        db.session.delete(setting)
        db.session.commit()
        response_body['message'] = f"Setting removed to user: {user_id}"
        return response_body, 200

    if request.method == 'PUT':
        if not (current_user['id'] == user_id) and not (current_user['role'] == 'admin'):
            response_body['message'] = f"You have no permissions to do that!"
            return response_body, 401
        setting = db.session.execute(db.select(User_settings).filter(User_settings.user_id == user_id, User_settings.setting_name.ilike(setting_name))).scalar()
        if not setting:
            response_body['message'] = f"Setting doesn't exists, cannot edit"
            return response_body, 400
        allowed_attributes = {  'setting_name': current_user['role'] == 'admin',
                                'setting_value': True}
        data = request.json
        required_data = ['setting_value']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        for key, value in data.items():
            if hasattr(setting, key) and allowed_attributes.get(key, False):
                setattr(setting, key, value)
        print(setting.serialize())
        db.session.commit()
        response_body['message'] = "Setting updated"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/reports", methods=['GET'])
@jwt_required()
def handle_reports():
    current_user = get_jwt_identity()
    if not (current_user['role'] == 'admin'):
        response_body['message'] = f"You have no permissions to do that!"
        return response_body, 401
    response_body = {}
    if request.method == 'GET':
        reports = db.session.execute(db.select(Reports)).scalars()
        response_body['results'] = [row.serialize() for row in reports]
        response_body['message'] = "Report list obtained"
        return response_body, 200
    

@api.route("/reports/<int:id>", methods=['GET', 'POST', 'PUT'])
@jwt_required()
def handle_create_report(id):
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        if not (current_user['role'] == 'admin'):
            response_body['message'] = f"You have no permissions to do that!"
            return response_body, 401
        reports_users = db.session.execute(db.select(Reports).where(Reports.reported_user_id == id)).scalars()
        reports_movies = db.session.execute(db.select(Reports).where(Reports.reported_movie_id == id)).scalars()
        response_body['results'] = {}
        response_body['results'][f"user reports with id {id}"] = [row.serialize() for row in reports_users]
        response_body['results'][f"movie reports with id {id}"] = [row.serialize() for row in reports_movies]
        response_body['message'] = f"Report list obtained"
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        required_data = ['reason']
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        report = Reports(user_id = current_user['id'],
                         reason = data.get('reason'),
                         reported_user_id = data.get('reported_user_id', None),
                         reported_movie_id = data.get('reported_movie_id', None),
                         resolver_id = None)
        db.session.add(report)
        db.session.commit()
        response_body['message'] = "Report saved"
        return response_body, 200

    if request.method == 'PUT':
        if not (current_user['role'] == 'admin'):
            response_body['message'] = f"You have no permissions to do that!"
            return response_body, 401
        report = db.session.execute(db.select(Reports).where(Reports.id == id)).scalar()
        data = request.json
        required_data = ['resolved']
        allowed_attributes = {'resolver_id': True,
                              'resolved': True}
        for key in required_data:
            if key not in data:
                response_body['message'] = f"Falta {key} en el body"
                return response_body, 400
        for key, value in data.items():
            if hasattr(report, key) and allowed_attributes.get(key, False):
                setattr(report, key, value)
        report.resolver_id = current_user['id']
        db.session.commit()
        response_body['message'] = "Report saved"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405

# Endpoints para manejor del reset email:
@api.route('/reset', methods=['POST'])
def reset():
    email = request.json.get('email')
    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify(message='Correo electrónico no registrado.'), 400
    safeTime = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])
    token = safeTime.dumps(user.email, salt='password-reset')
    reset_url = url_for('api.reset_with_token', token=token, _external=True)
    html = render_template('reset_password.html', reset_url=reset_url)
    subject = "Restablece tu contraseña"
    send_email(user.email, subject, html)

    return jsonify(message='Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.'), 200


@api.route('/reset/<token>', methods=['POST'])
def reset_with_token(token):
    try:
        safeTime = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])
        email = safeTime.loads(token, salt='password-reset', max_age=3600)
    except:
        return jsonify(message='El enlace de restablecimiento es inválido o ha expirado.'), 400

    user = Users.query.filter_by(email=email).first()
    new_password = request.json.get('new_password')
    user.password = encrypt_password(new_password)
    db.session.add(user)
    db.session.commit()

    return jsonify(message='Tu contraseña ha sido actualizada.'), 200
