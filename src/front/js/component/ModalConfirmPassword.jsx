import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Modal, Form } from "react-bootstrap";

export const ModalConfirmPassword = ({ show = false, handleClose, onPasswordConfirmed }) => {
    
    const { actions } = useContext(Context);
    const [currentPassword, setCurrentPassword] = useState('')

    const handleCheckPassword = async (event) => {
        event.preventDefault();
        const checkCurrentPassword = await actions.checkPassword({'password': currentPassword})
        if (checkCurrentPassword.results.correct == false){
            alert('Current password is incorrect!')
        } else {
            onPasswordConfirmed(true)
            handleClose()
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Please confirm your password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="my-3" controlId="formBasicPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={() => {onPasswordConfirmed(false), setCurrentPassword(''), handleClose()}}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={(e) => handleCheckPassword(e)}>Confirm Password</button>
            </Modal.Footer>
        </Modal>
    )
}