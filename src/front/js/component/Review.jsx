import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext.js'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export const Review = ({ movie_id, user = null}) => {

    const { store, actions } = useContext(Context)
    const [usernames, setUsernames] = useState({})
    const [review, setReview] = useState([])

    const getMovieInfo = async (id) => {
        const response = await actions.getMovie(id)
        const reviewsWithUsernames = await Promise.all(response.results.reviews.map(async review => {
            const user = await actions.getUserId(review.user_id)

            return { ...review, username: user.results.username }
        }))
        setReview(reviewsWithUsernames)
    }

    const getUserReviews = async () => {
        const response = await actions.getUser(user)
        const reviewsWithMovies = await Promise.all(response.results.reviews.map(async review => {
            const movie = await actions.getMovie(review.movie_id)
            return { ...review, movie_name: movie.results.title }
        }))
        setReview(reviewsWithMovies)
    }

    useEffect(() => {
        if (user) {
            getUserReviews(user)
        } else {
            getMovieInfo(movie_id)
        }
    }, [])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        return formattedDate;
    };



    return (
        user ?
         <div> <h4>Reviews publicadas por {user}</h4>
             {review.length < 1 ? <h4>El usuario aun no tiene ninguna review publicada</h4> : review.map((notas, index) => (
                 <Card key={index} className="my-4">
                     <Card.Header className="d-flex justify-content-between">
                     <p><b><Link to={"/movie/" + notas.movie_id}>{notas.movie_name}</Link></b> <i className="fas fa-star" style={{ "color": "#FFD43B" }}></i>{notas.rating}</p>
                         {/* <i className="fas fa-times text-secondary"></i> */}
                     </Card.Header>
                     <Card.Body>
                         <Card.Text className="pb-3 pt-1">
                             {notas.review_text}
                         </Card.Text>
                     </Card.Body>
                     <Card.Footer className="text-muted d-flex justify-content-between">
                         <p>{formatDate(notas.timestamp)}</p>
                         {/* <i className="fas fa-comments"></i> */}
                     </Card.Footer>
                 </Card>
             ))}
         </div>
         :
         <div>
             {review.map((notas, index) => (
                 <Card key={index} className="my-4">
                     <Card.Header className="d-flex justify-content-between">
                         <p><b><Link to={"/profile/" + notas.username}>{notas.username}</Link></b> <i className="fas fa-star" style={{ "color": "#FFD43B" }}></i>{notas.rating}</p>
                         {/* <i className="fas fa-times text-secondary"></i> */}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text className="pb-3 pt-1">
                            {notas.review_text}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted d-flex justify-content-between">
                        <p>{formatDate(notas.timestamp)}</p>
                        {/* <i className="fas fa-comments"></i> */}
                    </Card.Footer>
                </Card>
            ))}
        </div>
    )
}