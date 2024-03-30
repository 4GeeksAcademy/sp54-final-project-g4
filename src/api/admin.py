import os
from flask_admin import Admin
from .models import db, Users, Movies, Tags, Reviews, Playlists, Notifications, Followers, User_settings, Reports, Recommendations
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Movies, db.session))
    admin.add_view(ModelView(Tags, db.session))
    admin.add_view(ModelView(Reviews, db.session))
    admin.add_view(ModelView(Playlists, db.session))
    admin.add_view(ModelView(Notifications, db.session))
    admin.add_view(ModelView(User_settings, db.session))
    admin.add_view(ModelView(Reports, db.session))
    admin.add_view(ModelView(Recommendations, db.session))
    admin.add_view(ModelView(Followers, db.session))
