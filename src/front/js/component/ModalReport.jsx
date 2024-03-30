import React from "react";
import Modal from 'react-bootstrap/Modal';


export const ModalReport = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1 className='text-center fs-5'>Estas seguro que quieres reportar a</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <textarea id="reviewTextArea" className="form-control" style={{ width: '100%', height: '100px' }} placeholder="Your report">
                    </textarea>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-success btn-sm">Send report</button>
            </Modal.Footer>
        </Modal>
    );
    
}