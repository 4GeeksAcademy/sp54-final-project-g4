"""empty message

Revision ID: 53c63509e107
Revises: 
Create Date: 2024-04-10 15:31:07.453764

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '53c63509e107'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('movies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('release_date', sa.Date(), nullable=True),
    sa.Column('genre', sa.String(length=50), nullable=True),
    sa.Column('director', sa.String(length=100), nullable=True),
    sa.Column('trailer_url', sa.String(length=255), nullable=True),
    sa.Column('cover_url', sa.String(length=255), nullable=True),
    sa.Column('sinopsis', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('credits', sa.Integer(), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('bio', sa.String(length=240), nullable=True),
    sa.Column('referral_code', sa.String(length=10), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('referred_by', sa.String(length=10), nullable=True),
    sa.ForeignKeyConstraint(['referred_by'], ['users.referral_code'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('referral_code'),
    sa.UniqueConstraint('username')
    )
    op.create_table('favorite_movies',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'movie_id')
    )
    op.create_table('followers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('follower_id', sa.Integer(), nullable=False),
    sa.Column('following_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['follower_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['following_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('notification_text', sa.String(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('playlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recommendations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('recommendation_text', sa.String(length=500), nullable=True),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reports',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reason', sa.String(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('reported_user_id', sa.Integer(), nullable=True),
    sa.Column('reported_movie_id', sa.Integer(), nullable=True),
    sa.Column('resolved', sa.Boolean(), nullable=True),
    sa.Column('resolver_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['reported_movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['reported_user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['resolver_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('review_text', sa.String(length=1500), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tag_name', sa.String(length=50), nullable=False),
    sa.Column('movie_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('setting_name', sa.String(length=50), nullable=False),
    sa.Column('setting_value', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('movie_tags',
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ),
    sa.PrimaryKeyConstraint('movie_id', 'tag_id')
    )
    op.create_table('playlist_movies',
    sa.Column('playlist_id', sa.Integer(), nullable=False),
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.ForeignKeyConstraint(['playlist_id'], ['playlists.id'], ),
    sa.PrimaryKeyConstraint('playlist_id', 'movie_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('playlist_movies')
    op.drop_table('movie_tags')
    op.drop_table('user_settings')
    op.drop_table('tags')
    op.drop_table('reviews')
    op.drop_table('reports')
    op.drop_table('recommendations')
    op.drop_table('playlists')
    op.drop_table('notifications')
    op.drop_table('followers')
    op.drop_table('favorite_movies')
    op.drop_table('users')
    op.drop_table('movies')
    # ### end Alembic commands ###