import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext.js'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export const Review = ({movie_id=1}) => {

    const { store, actions } = useContext(Context)
    const [usernames, setUsernames] = useState({})
    const [review, setReview] = useState([])

    const getMovieInfo = async (id) => {
        console.log(id)
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
                <Card key={index} className="col-lg-6 col-sm-3 col-md-6 bg-light m-3">
                    <Card.Header className="d-flex justify-content-between">
                        <p><b>{notas.username}</b> <i className="fas fa-star" style={{"color": "#FFD43B"}}></i>{notas.rating}</p>
                        {/* <i className="fas fa-times text-secondary"></i> */}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
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