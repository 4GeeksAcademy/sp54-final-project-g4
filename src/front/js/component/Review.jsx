import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext.js'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export const Review = ({movie_id}) => {

    const { store, actions } = useContext(Context)
    const [usernames, setUsernames] = useState({})
    const [review, setReview] = useState([])

    const getMovieInfo = async (id) => {
        const response = await actions.getMovie(id)
        const reviewsWithUsernames = await Promise.all(response.results.reviews.map(async review => {
             const user = await actions.getUserId(review.user_id)
         
             return {...review, username: user.results.username}
         }))
         setReview(reviewsWithUsernames)
    }

    useEffect(() => {         
        getMovieInfo(movie_id)                           
    }, [])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        return formattedDate;
    };

   

    return (
        <div >
            {review.map((notas, index)=>(
                <Card key={index} className="my-4">
                    <Card.Header className="d-flex justify-content-between">
                        <p><b><Link to={"/profile/"+notas.username}>{notas.username}</Link></b> <i className="fas fa-star" style={{"color": "#FFD43B"}}></i>{notas.rating}</p>
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