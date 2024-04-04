import React from 'react';
import Modal from 'react-bootstrap/Modal';


function ReviewModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1 className='text-center fs-5'>Add your Review</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-center'>
                    <i className="fa-regular fa-star fa-2x text-warning text-opacity-50"></i>
                    <i className="fa-regular fa-star fa-2x text-warning text-opacity-50"></i>
                    <i className="fa-regular fa-star fa-2x text-warning text-opacity-50"></i>
                    <i className="fa-regular fa-star fa-2x text-warning text-opacity-50"></i>
                    <i className="fa-regular fa-star fa-2x text-warning text-opacity-50"></i>
                </h4>
            </Modal.Body>
            <Modal.Body>
            <textarea id="reviewTextArea" className="form-control" style={{ width: '100%', height: '200px' }} placeholder="Add your review">
                    </textarea>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-success btn-sm">Add review</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewModal