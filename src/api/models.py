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
    reviews = db.relationship('Reviews', backref='author', lazy=True)
    recommendations = db.relationship('Recommendations', backref='user', lazy=True)
    favorite_movies = db.relationship('Favorite_movies', backref='user', lazy=True)
    playlist = db.relationship('Playlists', backref='user_playlist', lazy=True)
    notifications = db.relationship('Notifications', backref='user', lazy=True)
    reports = db.relationship('Reports', backref='user_report', lazy=True, foreign_keys=('Reports.user_id'))
    reported_reports = db.relationship('Reports', backref='user_reported', lazy=True, foreign_keys=('Reports.reported_user_id') )
    resolved_reports = db.relationship('Reports', backref='user_resolved', lazy=True, foreign_keys=('Reports.resolver_id'))
    followers = db.relationship('Followers', foreign_keys=('Followers.follower_id'), backref='follower', lazy=True)
    followings = db.relationship('Followers', foreign_keys=('Followers.followed_id'), backref='followed', lazy=True)
    settings = db.relationship('User_settings', backref='user', lazy=True)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'username': self.username,
                'email': self.email,
                'credits': self.credits,
                'referral_code': self.referral_code,
                'role': self.role,
                'referred_by': self.referred_by,
                'recommendations': self.recommendations,
                'favorite_movies': self.favorite_movies,
                'reviews': self.reviews,
                'playlist': self.playlist,
                'notifications': self.notifications,
                'followers': self.followers,
                'followings': self.followings,
                'settings': self.settings,
                'reports': self.reports,
                'reported_reports': self.reported_reports,
                'resolved_reports': self.resolved_reports,
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
    reviews = db.relationship('Reviews', backref='movie_review', lazy=True)
    recommendations = db.relationship('Recommendations', backref='movie_recomendations', lazy=True)
    tags = db.relationship('Tags', backref='movie_tag', overlaps="tags", lazy=True)


    def __repr__(self):
        return f'<Movie: {self.id} -  titulo: {self.title}>'

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'release_date': self.release_date,
                'genre': self.genre,
                'director': self.director,
                'trailer_url': self.trailer_url,
                'cover': self.cover,
                'sinopsis': self.sinopsis,
                'tags': self.tags}

class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(50), unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=False)
    movie = db.relationship('Movies', backref='movie_tags', overlaps="movie_tags", lazy=True)

    def __repr__(self):
        return f'<Tag: {self.id} - pelicula: {self.movie_id} - etiqueta: {self.tag_name}>'

    def serialize(self):
        return {'id': self.id,
                'tag_name': self.tag_name,
                'movie_id': self.movie_id}

class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Float, unique=False, nullable=False)
    review_text = db.Column(db.String(1500), unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey(Users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(Movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Review: {self.id} - pelicula: {self.movie_id} - usuario: {self.user_id} - {self.rating}>'

    def serialize(self):
        return {'id': self.id,
                'rating': self.rating,
                'review_text': self.review_text,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'movie_id': self.movie_id}

class Favorite_movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(Users.id),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(Movies.id),unique=False, nullable=False)

    def __repr__(self):
        return f'<Favorite_movie: {self.id} - pelicula: {self.movie_id} - usuario: {self.user_id}>'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'movie_id': self.movie_id}

class Playlists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    movies = db.relationship('Playlists_movies', backref='playlist_movie', lazy=True)

    def __repr__(self):
        return f'<Playlist: {self.id} - nombre: {self.name} - usuario: {self.user_id}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'user_id': self.user_id,
                'movies': self.movies}

class Playlists_movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=False)

    def __repr__(self):
        return f'<Playlist_movie: {self.id} - playlist: {self.playlist_id} - pelicula: {self.movie_id} >'

    def serialize(self):
        return {'id': self.id,
                'playlist_id': self.playlist_id,
                'movie_id': self.movie_id}

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    notification_text = db.Column(db.String , unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)

    def __repr__(self):
        return f'<Notification: {self.id} - usuario: {self.user_id} >'

    def serialize(self):
        return {'id': self.id,
                'notification_text': self.notification_text,
                'timestamp': self.timestamp,
                'user_id': self.user_id}

class Followers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)

    def __repr__(self):
        return f'<Follower: {self.id} - seguidores: {self.follower_id} - seguidos: {self.followed_id}>'

    def serialize(self):
        return {'id': self.id,
                'follower_id': self.follower_id,
                'followed_id': self.followed_id}

class User_settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    setting_name = db.Column(db.String(50), unique=False, nullable=False)
    setting_value = db.Column(db.String, unique=False, nullable=False)

    def __repr__(self):
        return f'<Setting: {self.id} - usuario: {self.user_id} - settings: {self.setting_name}>'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'setting_name': self.setting_name,
                'setting_value': self.setting_value}

class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reason = db.Column(db.String , unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    reported_movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=True)
    resolved = db.Column(db.Boolean, default=False)
    resolver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('Users', backref='user_reports', foreign_keys=[user_id], overlaps="reports,user_report", lazy=True)
    reported_user = db.relationship('Users', backref='user_reported', foreign_keys=[reported_user_id], overlaps="reported_reports,user_reported", lazy=True)


    def __repr__(self):
        return f'<Report: {self.id} - usuario: {self.user_id} - {self.timestamp} - pelicula reportada: {self.reported_movie_id} - usuario reportado: {self.reported_user_id}>'

    def serialize(self):
        return {'id': self.id,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'reported_user_id': self.reported_user_id,
                'reported_movie_id': self.reported_movie_id,
                'resolved': self.resolved,
                'resolver_id': self.resolver_id}

class Recommendations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=False)
    recommendation_text = db.Column(db.String(500), unique=False, nullable=True)  # Añade más campos si es necesario

    def __repr__(self):
        return f'<Recommendation: {self.id} - usuario: {self.user_id} - pelicula: {self.movie_id}>'

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'movie_id': self.movie_id,
                'recommendation_text': self.recommendation_text}
