from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


# Tablas de relación
movie_tags = db.Table('movie_tags',
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

favorite_movies = db.Table('favorite_movies',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True)
)

playlist_movies = db.Table('playlist_movies',
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlists.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True)
)


# Tablas
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String , unique=False, nullable=False)
    credits = db.Column(db.Integer, default=0, unique=False, nullable=False)
    role = db.Column(db.String(20), default='user', unique=False, nullable=False)
    bio = db.Column(db.String(240), unique=False, nullable=True)
    referral_code = db.Column(db.String(10), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), default=True, unique=False, nullable=False)
    referred_by = db.Column(db.String(10), db.ForeignKey('users.referral_code'), unique=False, nullable=True)
    reviews = db.relationship('Reviews', backref='author', lazy=True)
    recommendations = db.relationship('Recommendations', backref='user', lazy=True)
    favorite_movies = db.relationship('Movies', secondary=favorite_movies, lazy='subquery', backref=db.backref('users', lazy=True))
    playlist = db.relationship('Playlists', backref='user', lazy=True)
    notifications = db.relationship('Notifications', backref='user', lazy=True)
    reports = db.relationship('Reports', backref='user_report_made_by', lazy=True, overlaps="reports,user_report_made_by", foreign_keys=('Reports.user_id'))
    reported_reports = db.relationship('Reports', backref='user_reported_in', lazy=True, foreign_keys=('Reports.reported_user_id') )
    resolved_reports = db.relationship('Reports', backref='resolved_by', lazy=True, foreign_keys=('Reports.resolver_id'))
    followers = db.relationship('Followers', backref='follower', foreign_keys=('Followers.follower_id'), lazy=True)
    followings = db.relationship('Followers', backref='following', foreign_keys=('Followers.following_id'), lazy=True)
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
                'bio': self.bio,
                'referred_by': self.referred_by,
                'recommendations': [row.serialize() for row in self.recommendations],
                'favorite_movies': [row.serialize() for row in self.favorite_movies],
                'reviews': [row.serialize() for row in self.reviews],
                'playlist': [row.serialize() for row in self.playlist],
                'notifications': [row.serialize() for row in self.notifications],
                'followers': [row.serialize() for row in self.followers],
                'followings': [row.serialize() for row in self.followings],
                'settings': [row.serialize() for row in self.settings],
                'reports': [row.serialize() for row in self.reports],
                'reported_reports': [row.serialize() for row in self.reported_reports],
                'resolved_reports': [row.serialize() for row in self.resolved_reports],
                'is_active': self.is_active}
    
    def serialize_public(self):
        return {'id': self.id,
                'username': self.username,
                'referral_code': self.referral_code,
                'referred_by': self.referred_by,
                'role': self.role,
                'bio': self.bio,
                'credits': self.credits,
                'is_active': self.is_active,
                'reviews': [row.serialize() for row in self.reviews],
                'playlist': [row.serialize() for row in self.playlist],
                'followers': [row.serialize() for row in self.followers],
                'followings': [row.serialize() for row in self.followings],
                'settings': [row.serialize() for row in self.settings]}

    def serialize_followers(self):
        return {'id': self.id,
                'username': self.username,
                'referral_code': self.referral_code,
                'role': self.role,
                'bio': self.bio,
                'is_active': self.is_active,
                'followers': [row.serialize() for row in self.followers],
                'followings': [row.serialize() for row in self.followings]}


class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=False)
    release_date = db.Column(db.Date, unique=False, nullable=True)
    genre = db.Column(db.String(50), unique=False, nullable=True)
    director = db.Column(db.String(100), unique=False, nullable=True)
    trailer_url = db.Column(db.String(255), unique=False, nullable=True)
    cover_url = db.Column(db.String(255), unique=False, nullable=True)
    sinopsis = db.Column(db.String , unique=False, nullable=True)
    reviews = db.relationship('Reviews', backref='movie_review', lazy=True)
    recommendations = db.relationship('Recommendations', backref='movie_recomendation', lazy=True)
    tags = db.relationship('Tags', secondary=movie_tags, lazy='subquery', backref=db.backref('movies', lazy=True))
    is_active = db.Column(db.Boolean(), default=True, unique=False, nullable=False)

    def __repr__(self):
        return f'<Movie: {self.id} -  titulo: {self.title}>'

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'release_date': self.release_date,
                'genre': self.genre,
                'director': self.director,
                'trailer_url': self.trailer_url,
                'cover_url': self.cover_url,
                'sinopsis': self.sinopsis,
                'reviews': [row.serialize() for row in self.reviews],
                'tags': [row.serialize() for row in self.tags],
                'recommendations': [row.serialize() for row in self.recommendations],
                'is_active': self.is_active}


class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(50), unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=True)

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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),unique=False, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'),unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Review: {self.id} - pelicula: {self.movie_id} - usuario: {self.user_id} - {self.rating}>'

    def serialize(self):
        return {'id': self.id,
                'rating': self.rating,
                'review_text': self.review_text,
                'timestamp': self.timestamp,
                'user_id': self.user_id,
                'movie_id': self.movie_id,
                'is_active': self.is_active}


class Playlists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)
    movies = db.relationship('Movies', secondary=playlist_movies, lazy='subquery', backref=db.backref('playlists', lazy=True))

    def __repr__(self):
        return f'<Playlist: {self.id} - nombre: {self.name} - usuario: {self.user_id}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'user_id': self.user_id,
                'movies': [row.serialize() for row in self.movies]}


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
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=False)

    def __repr__(self):
        return f'<Follower: {self.id} - seguidores: {self.follower_id} - seguidos: {self.following_id}>'

    def serialize(self):
        return {'id': self.id,
                'follower_id': self.follower_id,
                'following_id': self.following_id}


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
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=True)
    reported_movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), unique=False, nullable=True)
    resolved = db.Column(db.Boolean, default=False)
    resolver_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=False, nullable=True)

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
