from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String , unique=False, nullable=False)
    credits = db.Column(db.Integer, default=0, unique=False, nullable=False)
    role = db.Column(db.String(20), default='user', unique=False, nullable=False)
    referral_code = db.Column(db.String(10), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    referred_by = db.Column(db.String(10), db.ForeignKey('users.referral_code'), unique=False, nullable=True)
    reviews = db.relationship('Reviews', backref='author')
    recommendations = db.relationship('Recommendations', backref='user')
    comments = db.relationship('Comments', backref='user')
    favorite_movies = db.relationship('Favorite_movies', backref='user')
    playlist = db.relationship('Playlists', backref='user')
    notifications = db.relationship('Notifications', backref='user')
    reports = db.relationship('Reports', backref='user')
    followers = db.relationship('Followers', foreign_keys=[Followers.followed_id], backref='followed')
    followings = db.relationship('Followers', foreign_keys=[Followers.followed_id], backref='followed')
    settings = db.relationship('User_settings', backref='user')

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'username': self.username,
                'email': self.email,
                'credits': self.credits,
                'referral_code': self.referral_code,
                'role': self.role,
                'referred_by': self.referred_by,
                'recommendations': self.recommendations,
                'comments': self.comments,
                'favorite_movies': self.favorite_movies,
                'reviews': self.reviews,
                'playlist': self.playlist,
                'notifications': self.notifications,
                'followers': self.followers,
                'followings': self.followings,
                'settings': self.settings,
                'reports': self.reports,
                'is_active': self.is_active}


class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=False)
    release_date = db.Column(db.Date, unique=False, nullable=True)
    genre = db.Column(db.String(50), unique=False, nullable=True)
    director = db.Column(db.String(100), unique=False, nullable=True)
    trailer_url = db.Column(db.String(255), unique=False, nullable=True)
    cover = db.Column(db.String(255), unique=False, nullable=True)
    sinopsis = db.Column(db.String , unique=False, nullable=True)
    reviews = db.relationship('Reviews', backref='movie')
    comments = db.relationship('Commnets', backref='movie')
    recommendations = db.relationship('Recommendations', backref='movie')
    tags = db.relationship('Tags', backref='movie')

    def __repr__(self):
        return f'<Movie: {self.id} - {self.title}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'title': self.title,
                'release_date': self.release_date,
                'genre': self.genre,
                'director': self.director,
                'trailer_url': self.trailer_url,
                'cover': self.cover,
                'sinopsis': self.sinopsis,
                'review': self.review,
                'comments': self.comments,
                'tags': self.tags}


class Reviews(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Float, unique=False, nullable=False)
    review_text = db.Column(db.String(1500), unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey(users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Review: {self.id} - {self.movie_id} - {self.user_id} - {self.rating}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'rating': self.rating,
                'review_text': self.review_text,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'movie_id': self.movie_id}


class Comments(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    comment_text = db.Column(db.String(1500), unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey(users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Comment: {self.id} - {self.movie_id} - {self.user_id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'commnet_text': self.comment_text,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'movie_id': self.movie_id}


class Recommendations(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey(users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Recommendation: {self.id} - {self.movie_id} - {self.user_id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'movie_id': self.movie_id}


class Favorite_movies(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Favorite_movie: {self.id} - {self.movie_id} - {self.user_id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'user_id': self.user_id,
                'movie_id': self.movie_id}


class Playlists(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(users.id),unique=False, nullable=False)
    movies = db.relationship('Playlist_movies', backref='playlists')

    def __repr__(self):
        return f'<Playlist: {self.id} - {self.name} - {self.user_id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'name': self.name,
                'user_id': self.user_id,
                'movies': self.movies}


class Playlists_movies(db.Models):
    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey(playlists.id), unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(movies.id), unique=False, nullable=False)

    def __repr__(self):
        return f'<Playlist: {self.id} - {self.playlist_id} >'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'playlist_id': self.playlist_id_id,
                'movie_id': self.movie_id}


class Notifications(bd.Models):
    id = db.Column(db.Integer, primary_key=True)
    notification_text = db.Column(db.String , unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)


class Followers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)


class User_settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    setting_name = db.Column(db.String(50), unique=False, nullable=False)
    setting_value = db.Column(db.String(255), unique=False, nullable=False)


class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reason = db.Column(db.String , unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    reported_movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=True)
    resolved = db.Column(db.Boolean, default=False)
    resolver_id = db.Column(db.Integer, db.ForeignKey('users.id'))