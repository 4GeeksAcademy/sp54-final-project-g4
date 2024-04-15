import React, { useContext, useState, useEffect } from "react";
import { Navigate, useParams } from 'react-router-dom'
import { Context } from '../store/appContext';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Spinner } from "../component/Spinner.jsx";
import { ReviewModal } from "../component/ReviewModal.jsx"
import { Review } from "../component/Review.jsx"

export const MovieDetails = () => {
    const { store, actions } = useContext(Context);
    const [hover, setHover] = useState(null);
    const [selected, setSelected] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);
    const [movieDetails, setMovieDetails] = useState({
        "cover_url": "",
        "director": "",
        "genre": "",
        "is_active": true,
        "release_date": "Tue, 31 Dec 2024 00:00:00 GMT",
        "sinopsis": "sinopsis",
        "tags": [],
        "title": "placeholder",
        "trailer_url": ""
    });
    const params = useParams()

    const getMovieDetails = async () => {
        const response = await actions.getMovie(params.movieid);
        if (response) {
            const releaseDate = new Date(response.results.release_date)
            response.results.release_date = releaseDate.getDate() + '/' + (releaseDate.getMonth() + 1) + '/' + releaseDate.getFullYear()
        }
        setMovieDetails(response.results);
    };

    const openForm = (i) => {
        setModalStatus(true)
        setSelected(i + 1)
    }

    const closeForm = () => {
        setModalStatus(false)
    }

    useEffect(() => {
        getMovieDetails();
    }, []);

    if (movieDetails.title == "placeholder") {
        return <Spinner color="blue" />;
    } else if (!movieDetails.title) {
        return <Navigate to='/404' />;
    } else {
        return (
            <div className="movie-borders py-5">

                <Container className=" ">
                    <Row className="border">
                        <Col md={4} className="movie-details-left py-2">
                            <Card style={{ width: '18rem' }} className="card-shadow">
                                <Card.Img variant="top" src={movieDetails.cover_url ?? "https://placehold.co/400x600"} />
                                <Card.Footer className="fs-2 text-center">
                                    {[...Array(5)].map((star, i) => {
                                        return (
                                            <i
                                                key={i}
                                                className={`fa-star text-warning mx-1 ${i + 1 <= (hover || selected) ? "fas" : "far"}`}
                                                onMouseEnter={() => setHover(i + 1)}
                                                onMouseLeave={() => setHover(null)}
                                                onClick={() => openForm(i)}
                                            />
                                        );
                                    })}
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col md={5} className="movie-details-center py-2">
                            <h2>{movieDetails.title}</h2>
                            <p>Director: {movieDetails.director}</p>
                            <p>Release date: {movieDetails.release_date}</p>
                            <p>Genre: {movieDetails.genre}</p>
                            <h3>Sinopsis</h3>
                            <p>{movieDetails.sinopsis}</p>
                            <iframe width="560" height="315" src={movieDetails.trailer_url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </Col>
                        <Col md={3} className="movie-details-right py-2">
                            {movieDetails.tags.length > 0 && movieDetails.tags.map((tag, index) => (
                                <Button className="m-2 " disabled key={index}>{tag.tag_name}</Button>
                            ))}
                        </Col>
                    </Row>
                    <hr />
                    <ReviewModal movie_id={params.movieid} show={modalStatus} score={selected} onHide={closeForm} />
                    <Col md={4}>
                        <h4>Reviews</h4>
                    </Col>
                    <Row className="ms-auto d-flex align-items-end justify-content-end">
                        <Col md={8}>
                            <Review movie_id={params.movieid} page='movieDetails' />
                        </Col>
                    </Row>
                </Container >
            </div>
        )
    }
}
