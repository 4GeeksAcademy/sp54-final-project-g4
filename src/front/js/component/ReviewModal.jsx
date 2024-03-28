import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';



export const ModalForReview = ({ onHide }) => {
   
    return (
        <>
            <Modal show={true} onHide={onHide} dialogClassName="modal-200w" aria-labelledby="example-custom-modal-styling-title" >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">
                        <i class="fa-regular fa-star fa-2x"></i>
                        <i class="fa-regular fa-star fa-2x"></i>
                        <i class="fa-regular fa-star fa-2x"></i>
                        <i class="fa-regular fa-star fa-2x"></i>
                        <i class="fa-regular fa-star fa-2x"></i>
                    </Modal.Title>
                    
                </Modal.Header>

                <Modal.Body>
                    <h4 className="text-center">Review</h4>
                    <textarea id="reviewTextArea" className="form-control" style={{ width: '100%', height: '200px' }} placeholder="Add your review">
                    </textarea>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success btn-sm">Add review</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}