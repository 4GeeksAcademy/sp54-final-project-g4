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
        avatar_url: ''
    })

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (confirmPassword === formData.password) {
            actions.signup(formData)
            alert('[PH] Registration Succesful!')
            actions.showModalSignup(false)
        } else {
            alert("Passwords doesn't match")
        }
    }

    const handleCancel = () => {
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
                    <Form.Control type="password" placeholder="Password" name='password' value={formData.password} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicImage">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control type="text" placeholder="http://www.url-image.com" name='avatar_url' value={formData.avatar_url} onChange={(e) => handleInputChange(e)} />
                    <Form.Text className="text-muted">
                        Leave blank for placeholder
                    </Form.Text>
                </Form.Group>

                <Form.Group className="text-center mt-5">
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