"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random
import string
import bcrypt

from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from flask_jwt_extended import (get_jwt, jwt_required, create_access_token, get_jwt_identity)

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


def check_rating(rating):
    return max(0.0, min(rating, 5.0))


# API Endpoints
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
                     is_active = True,
                     referred_by = reffered_by)
        db.session.add(user)
        db.session.commit()
        response_body['message'] = f"User {data.get('username')} added."
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
            user = db.session.execute(db.select(Users).filter(Users.email.ilike(email))).scalar()
        if user:
            if user.is_active:
                password = request.json.get("password", None)
                if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                    access_token = create_access_token(identity=user.serialize_public())
                    response_body["message"] = f"User logged correctly"
                    response_body["access_token"] = access_token
                    response_body["results"] = user.serialize_public()
                    return response_body, 200
                response_body["message"] = "Incorrect password."
                return response_body, 401
            response_body["message"] = "Account is inactive"
            return response_body, 401
        response_body["message"] = "User is not registered."
        return response_body, 401
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
        return response_body, 200

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
                                  'credits': current_user['role'] == 'admin',
                                  'role': current_user['role'] == 'admin',
                                  'is_active': True}
            if current_user['username'] == user.username or current_user['role'] == 'admin':
                for key, value in data.items():
                    if hasattr(user, key) and allowed_attributes.get(key, False):
                        if key == 'password':
                            value = encrypt_password(value)
                        setattr(user, key, value)
                db.session.commit()
                response_body['message'] = f"{username} updated"
                return response_body, 200
            response_body['message'] = "wtf are u trying to do?."
            return response_body, 401
        response_body['message'] = "Token is required to edit user's info"
        return response_body, 401
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
        return response_body, 401
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
        if current_user['id'] == review.user_id or current_user['role'] == 'admin':
            for key, value in data.items():
                if hasattr(review, key) and allowed_attributes.get(key, False):
                    setattr(review, key, value)
            db.session.commit()
            response_body['message'] = f"Review updated"
            return response_body, 200
        response_body['message'] = "wtf are u trying to do?."
        return response_body, 401
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/playlists/<int:user_id>", methods=['GET','POST'])
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
        print(playlist)
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

    if request.method == 'POST':
        data = request.json
        db.session.add(playlist)
        db.session.commit()
        response_body['message'] = f"Playlist {data['name']} successfully added"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405



@api.route("/playlists/<int:user_id>/<int:playlist_id>", methods=['GET'])
def handle_playlists_user_playlist(user_id, playlist_id):
    response_body = {}
    if request.method == 'GET':
        playlist = db.session.execute(db.select(Playlists).where(Playlists.user_id == user_id, Playlist.id == playlist_id)).scalar()
        response_body['results'] = playlist.serialize()
        response_body['message'] = 'Playlists obtained'
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405

## <-- Continue from here

@api.route("/playlists/<int:playlist_id>/managemovies/<int:movie_id>", methods=['POST', 'DELETE'])
def handle_manage_movies_to_playlist(playlist_id, movie_id):
    response_body = {}
    if request.method == 'POST':
        playlist = db.session.execute(db.select(Playlists).where(Playlists.id == playlist_id)).scalar()
        movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
        playlist.movies.append(movie)
        db.session.commit()
        response_body['message'] = f"Movie {movie_id} successfully added to {playlist_id}"
        return response_body, 200

    if request.method == 'DELETE':
        playlist = db.session.execute(db.select(Playlists).where(Playlists.id == playlist_id)).scalar()
        movie = db.session.execute(db.select(Movies).where(Movies.id == movie_id)).scalar()
        playlist.movies.remove(movie)
        db.session.commit()
        response_body['message'] = f"Movie {movie_id} successfully removed to {playlist_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


# Borrar notis
@api.route("/notifications/<int:user_id>", methods=['GET', 'POST'])
def handle_notifications(user_id):
    response_body = {}
    if request.method == 'GET':
        notifications = db.session.execute(db.select(Notifications).where(Notifications.user_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in notifications]
        response_body['message'] = "Notifications obtained"
        return response_body, 200     

    if request.method == 'POST':
        data = request.json
        notification = Notifications(
            notification_text = data['notification'],
            user_id = user_id)
        db.session.add(notification)
        db.session.commit()
        response_body['message'] = "Notification successfully registered"
        response_body['results'] = f"({data['notification']}) added to user: {user_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/followers/<int:user_id>", methods=['GET'])
def handle_followers(user_id):
    response_body = {}
    if request.method == 'GET':
        followers = db.session.execute(db.select(Followers).where(Followers.following_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in followers]
        response_body['message'] = f"Followers from {user_id} obtained"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/following/<int:user_id>", methods=['GET'])
def handle_following(user_id):
    response_body = {}
    if request.method == 'GET':
        followers = db.session.execute(db.select(Followers).where(Followers.follower_id == user_id)).scalars()
        response_body['results'] = [row.serialize() for row in followers]
        response_body['message'] = f"{user_id} follows:"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405

# Juntar ambos endpoints 
@api.route("/managefollows/<int:follower_id>/<int:following_id>", methods=['POST', 'DELETE'])
def handle_manage_follows(follower_id, following_id):
    response_body = {}
    if request.method == 'POST':
        follows = Followers(follower_id = follower_id, following_id = following_id)
        db.session.add(follows)
        db.session.commit()
        response_body['message'] = f"{follower_id} is now following {following_id}"
        return response_body, 200

    if request.method == 'DELETE':
        follows = db.session.execute(db.select(Followers).where(Followers.follower_id == follower_id and Followers.following_id == following_id)).scalar()
        if follows: 
            print(follows)
            db.session.remove(follows)
            db.session.commit()
            response_body['message'] = f"{follower_id} is now not following {following_id} :("
            return response_body, 200
        response_body['message'] = f"{follower_id} is not following {following_id}"
        return response_body, 404
    response_body['message'] = "Method not allowed."
    return response_body, 405

# Hasta aquí

@api.route("/settings/<int:user_id>", methods=['POST'])
def handle_user_settings(user_id):
    response_body = {}
    if request.method == 'POST':
        data = request.json
        setting = User_settings(user_id = user_id,
                                setting_name = data['setting_name'],
                                setting_value = data['setting_value'])
        db.session.add(setting)
        db.session.commit()
        response_body['message'] = "Changes updated"
        response_body['results'] = f"Changes added to user: {user_id}"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405

@api.route("/settings/<int:user_id>/<int:setting_id>", methods= ['DELETE'])
def handle_delete_settings(user_id, setting_id):    
    response_body = {}
    if request.method == 'DELETE':
        settings = db.session.execute(db.select(User_settings).where(User_settings.user_id == user_id and User_settings.id == setting_id)).scalar()
        if settings: 
            db.session.remove(settings)
            db.session.commit()
            response_body['message'] = f"Setting removed"
            return response_body, 200
    response_body['message'] = f"No settings found"
    return response_body, 404


@api.route("/reports", methods=['GET'])
def handle_reports(user_id):
    response_body = {}
    if request.method == 'GET':
        reports = db.session.execute(db.select(Reports)).scalars()
        response_body['results'] = [row.serialize() for row in reports]
        response_body['message'] = 'Report list obtained'
        return response_body, 200
    

@api.route("/reports/<int:user_id>", methods=['POST'])
def handle_create_report(user_id):
    response_body = {}
    if request.method == 'POST':
        data = request.json
        report = Reports(user_id = user_id,
                         reason = data.get('reason'),
                         reported_user_id = data.get('reported_user', None),
                         reported_movie_id = data.get('reported_movie', None),
                         resolver_id = None)
        db.session.add(report)
        db.session.commit()
        response_body['message'] = "Changes updated"
        response_body['results'] = f"Report send"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405


@api.route("/recomendations/<int:user_id>/<int:movie_id>", methods=['POST'])
def handle_recomendations(user_id, movie_id):
    response_body = {}
    if request.method == 'POST':
        data = request.json
        recommendation = Recommendations(user_id = user_id,
                                         recommendation_text = data.get('recommendation_text'),
                                         movie_id = movie_id
                                        )
        db.session.add(recommendation)
        db.session.commit()
        response_body['message'] = "Changes updated"
        response_body['results'] = f"Report send"
        return response_body, 200
    response_body['message'] = "Method not allowed."
    return response_body, 405