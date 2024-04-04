# Star Trail API Documentation

This is the documentation for the Star Trail backend API.

## Base URL

The base URL for all endpoints is `{{base_url}}`.

## Authentication

This API uses bearer token authentication. To authenticate, include your token in the `Authorization` header with the format `Bearer {{token}}`.

## Endpoints

### /login and /signup

#### POST /api/signup

This endpoint is used to sign up a new user.

**Request Body:**

```json
{
    "username": "username",
    "email": "email@email.com",
    "referred_by": "code", // Optional
    "password": "contraseña"
}
```

#### POST /api/login

This endpoint is used to log in a user. Username or Email should be added. If both are given, email is priority. Frontend should allow only one to be send.

**Request Body:**

```json
{
    "username": "username", // Optional if email is given
    "email": "email@email.com", // Optional if username is given
    "password": "contraseña"
}
```

### /users/<username>

#### GET /api/users

This endpoint gets the users list. If the user role is admin, the user_list will contain more data.

#### GET /api/users/username

This endpoint gets users profile information. If the user role is admin or is the own user, the user_list will contain more data.

#### PUT /api/users/username

This endpoint edits a user's profile information. If the user role is admin, more data can be edited.

**Request Body:**

```json
{
    "username": "username",
    "password": "password",
    "email": "email@email.com",
    "credits": 0, // Can only be edited if current user is admin
    "role": "user", // Can only be edited if current user is admin
    "is_active": true
}
```

### /movies

#### GET /api/movies

This endpoint gets the movies list.

#### POST /api/movies

This endpoint registers a new movie.

**Request Body:**

```json
{
    "title": "Titulo de la pelicula",
    "released": "2024-12-31", // Optional
    "genre": "genero", // Optional
    "director": "director", // Optional
    "trailer_url": "http://trailer-url.com", // Optional
    "cover_url": "http://cover-url.com", // Optional
    "sinopsis": "sinopsis" // Optional
}
```

### /movies/<movie_id>

#### GET /api/movies/1

This endpoint gets movie info.

#### PUT /api/movies/1

This endpoint edits movie info if admin.

**Request Body:**

```json
{
    "title": "Titulo de la pelicula",
    "release_date": "2024-12-31", // Optional
    "genre": "genero", // Optional
    "director": "director", // Optional
    "trailer_url": "http://trailer-url.com", // Optional
    "cover_url": "http://cover-url.com", // Optional
    "sinopsis": "sinopsis", // Optional
    "is_active": true // Optional
}
```

### /movies/<movie_id>/managetags/<tag_id>

#### POST /api/movies/1/managetags/1

This endpoint adds a tag to a movie.

#### DELETE /api/movies/1/managetags/1

This endpoint removes a tag from a movie.

### /tags/<tag_id>

#### PUT /api/tags/1

This endpoint edits a tag name.

**Request Body:**

```json
{
    "tag_name": "tag name"
}
```

### /reviews/<movie_id>/<user_id>

#### GET /api/reviews/1/1

This endpoint gets a review.

#### POST /api/reviews/1/1

This endpoint posts a review.

**Request Body:**

```json
{
    "rating": 0.0,
    "review_text": "review text"
}
```

#### PUT /api/reviews/1/1

This endpoint edits a review.

**Request Body:**

```json
{
    "rating": 0.0,
    "review_text": "review text"
}
```

### /playlists/<user_id>

#### GET /api/playlists/1

This endpoint gets a playlist.

#### POST /api/playlists/1

This endpoint creates a playlist.

**Request Body:**

```json
{
    "name": "Playlist name"
}
```

### /playlists/<playlist_id>/managemovies/<movie_id>

#### POST /api/playlists/1/managemovies/1

This endpoint adds a movie to a playlist.

#### DELETE /api/playlists/1/managemovies/1

This endpoint removes a movie from a playlist.

### /notifications/<user_id>

#### GET /api/notifications/1

This endpoint gets notifications.

#### POST /api/notifications/1

This endpoint posts a notification.

**Request Body:**

```json
{
    "notification_text": "Notification"
}
```

#### DELETE /api/notifications/1/1

This endpoint deletes a notification.

### /managefollows/<follower_id>/<following_id>

#### POST /api/managefollows/1/3

This endpoint follows a user.

#### DELETE /api/managefollows/1/3

This endpoint unfollows a user.

### /settings/<user_id>/<setting_name>

#### POST /api/settings/1/setting_name

This endpoint sets a setting.

**Request Body:**

```json
{
    "setting_value": "Exists"
}
```

#### PUT /api/settings/1/setting_name

This endpoint edits a setting.

**Request Body:**

```json
{
    "setting_value": "Exists"
}
```

#### DELETE /api/settings/1/setting_name

This endpoint deletes a setting.

### /reports

#### GET /api/reports

This endpoint gets reports.

### /reports/<user_id>

#### GET /api/reports/1

This endpoint gets a report.

#### POST /api/reports/1

This endpoint posts a report.

**Request Body:**

```json
{
    "reason": "Report text",
    "reported_user_id": 1, // id of the reported user, in movie case, do not include
    "reported_movie_id": 1 // id of the reported user, in movie case, do not include
}
```

#### PUT /api/reports/2

This endpoint resolves a report.

**Request Body:**

```json
{
    "resolved": true
}
```