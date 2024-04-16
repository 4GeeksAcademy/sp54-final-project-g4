import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Modal, Form } from "react-bootstrap";

export const ModalForgotPassword = ({ show = false, handleClose }) => {
    
    const { actions } = useContext(Context);
    const [userEmail, setUserEmail] = useState('')

    const handleSendEmail = async (event) => {
        event.preventDefault();
        const response = actions.resetPassword({'email': userEmail})
        alert('Email sent check your inbox')
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Please enter your email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="my-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="email" name='email' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={() => {setUserEmail(''), handleClose()}}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={(e) => handleSendEmail(e)}>Confirm Password</button>
            </Modal.Footer>
        </Modal>
    )
}