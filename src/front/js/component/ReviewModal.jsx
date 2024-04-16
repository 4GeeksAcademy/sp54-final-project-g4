import React, { useContext, useState, useEffect } from "react";
import { Navigate } from 'react-router-dom'
import { Context } from '../store/appContext';
import Modal from 'react-bootstrap/Modal';

export const ReviewModal = (props) => {
    const { store, actions } = useContext(Context);
    const [hover, setHover] = useState(null);
    const [selected, setSelected] = useState(props.score);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        setSelected(props.score);
    }, [props.score]);

    // useEffect(() => {
    //     if (props.edit && props.edit == 1) {
    //         getReviewData();
    //     };
    // }, []);

    // const getReviewData = async () =>{
    //     if (localStorage.access_token) {
    //         const userInfo = await actions.getUserLoggedIn();
    //         const response = await actions.getUser(userInfo.results.username)
    //         const rvw = response.results.reviews.find(obj => obj.movie_id == props.movie_id)
    //         setReviewText(rvw.review_text)
    //         setSelected(rvw.rating)
    //     }
    // }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (localStorage.access_token) {
            const userInfo = await actions.getUserLoggedIn();
            if (props.edit && props.edit == 1) {
                const response = await actions.editReview(props.movie_id, userInfo.results.id, {
                    "rating": selected,
                    "review_text": reviewText
                })
                alert(response.message)
                window.location.reload(true)
            } else {
                const response = await actions.postReview(props.movie_id, userInfo.results.id, {
                    "rating": selected,
                    "review_text": reviewText
                })
                alert(response.message)
                window.location.reload(true)
            }
        } else {
            alert("You must be logged in to post a review!")
            actions.showModalSignin(true)
        }
    }

    if (props.edit && props.edit == 1) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={props.onHide}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h1 className='text-center fs-5'>Edit your Review</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>
                        {[...Array(5)].map((star, i) => {
                            return (
                                <i
                                    key={i}
                                    className={`fa-star text-warning mx-1 ${i + 1 <= (hover || selected) ? "fas" : "far"}`}
                                    value={i + 1}
                                    onMouseEnter={() => setHover(i + 1)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => setSelected(i + 1)}
                                />
                            );
                        })}
                    </h4>
                </Modal.Body>
                <form onSubmit={handleOnSubmit}>
                    <Modal.Body>
                        <textarea
                            id="reviewTextArea"
                            className="form-control"
                            style={{ width: '100%', height: '200px' }}
                            placeholder="Add your review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        >
                        </textarea>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-success btn-sm">Edit review</button>
                    </Modal.Footer>
                </form>
            </Modal>
        )
    } else return (

        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton onClick={props.onHide}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1 className='text-center fs-5'>Add your Review</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-center'>
                    {[...Array(5)].map((star, i) => {
                        return (
                            <i
                                key={i}
                                className={`fa-star text-warning mx-1 ${i + 1 <= (hover || selected) ? "fas" : "far"}`}
                                value={i + 1}
                                onMouseEnter={() => setHover(i + 1)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => setSelected(i + 1)}
                            />
                        );
                    })}
                </h4>
            </Modal.Body>
            <form onSubmit={handleOnSubmit}>
                <Modal.Body>
                    <textarea
                        id="reviewTextArea"
                        className="form-control"
                        style={{ width: '100%', height: '200px' }}
                        placeholder="Add your review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    >
                    </textarea>
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-success btn-sm">Add review</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}