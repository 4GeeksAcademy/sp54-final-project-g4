import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Modal, Form } from "react-bootstrap";
import { ModalConfirmPassword } from './ModalConfirmPassword.jsx';
import { useNavigate } from "react-router-dom";


export const ModalPassword = ({ username, show = false, handleClose }) => {
    const { actions } = useContext(Context);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const navigate = useNavigate()

    const handleOpenConfirm = () => {
        setShowPasswordConfirm(true)
    }

    const handleCloseConfirm = () => {
        setShowPasswordConfirm(false)
    }

    const handlePasswordConfirmation = (isCorrect) => {
        setIsPasswordCorrect(isCorrect);
    }

    const handleSavePassword = async (event) => {
        event.preventDefault();
        if (confirmPassword !== newPassword){
            return alert("Passwords doesn't match")
        }

        if (!isPasswordCorrect) {
            return handleOpenConfirm();
        }

        const confirmUpdate = window.confirm("You will be logged out to update your user profile.")
        if (confirmUpdate) {
            const response = await actions.editUser(username, { "password": newPassword })
            setConfirmPassword('')
            alert(response.message)
            actions.signedOut()
            navigate('/')
        }

        handleCloseConfirm();
    }
    useEffect(() => {
    }, [])

    // Esto puede causar bugs, aun sin testear bien
    useEffect(() => {
        if (isPasswordCorrect) {
            handleSavePassword();
        }
    }, [isPasswordCorrect])

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="my-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSavePassword}>Save changes</button>
                </Modal.Footer>
            </Modal>
            <ModalConfirmPassword show={showPasswordConfirm} handleClose={handleCloseConfirm} onPasswordConfirmed={handlePasswordConfirmation} />

        </>
    )
}