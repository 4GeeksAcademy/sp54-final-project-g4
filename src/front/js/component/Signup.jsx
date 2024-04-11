import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Form, Modal } from 'react-bootstrap';

export const Signup = () => {

    const { store, actions } = useContext(Context)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'password' && value.length > 8) {
            return;
        }
        setFormData({ ...formData, [name]: value.trim() });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password.length !== 8) {
            alert("Password must be exactly 8 characters long.");
            return; 
        }
        if (confirmPassword === formData.password) {
            const response = await actions.signup(formData)
            response ? alert(response) : alert("Credentials are invalid!")
            setFormData({ username: '', email: '', password: '' })
            setConfirmPassword('')
            actions.showModalSignup(false)
        } else {
            alert("Passwords doesn't match")
        }
    }

    const handleSwitch = (e) => {
        e.preventDefault();
        setFormData({username: '', email: '', password: ''})
        actions.showModalSignup(false)
        actions.showModalSignin(true)
    }

    const handleCancel = () => {
        setFormData({username: '', email: '', password: ''})
        actions.showModalSignup(false)
    }
    
    return (
        <Modal show={store.showModalSignup}>
            <Form onSubmit={handleSubmit} className="m-3">
                <Form.Group className="my-3" controlId="formBasicUsername">
                    <Form.Label>Username *</Form.Label>
                    <Form.Control type="text" placeholder="Username" name='username' value={formData.username} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Email address *</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name='email' value={formData.email} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicPassword">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control type="password" placeholder="Password" name='password' value={formData.password} onChange={(e) => handleInputChange(e)} maxLength={8} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="text-center mt-5">
                    <p>Already have an account? <a href='#' onClick={(e) => handleSwitch(e)}>Click here to login!</a></p>
                    <Button className="mx-2 px-2" variant="danger" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="mx-2 px-2" variant="success" type="submit">
                        Register
                    </Button>
                </Form.Group>
            </Form>
        </Modal>
    )
}