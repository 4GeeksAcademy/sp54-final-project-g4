import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Button, Form, Modal }from 'react-bootstrap';

export const Login = ({ show = false }) => {

    const { store, actions } = useContext(Context)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        actions.signin(formData)
        actions.showModalSignin(false)
    }

    const handleCancel = () => {
        actions.showModalSignin(false)
    }

    return (
        <Modal show={store.showModalSignin}>
            <Form onSubmit={handleSubmit} className="m-3">
                <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Email address *</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name='email' value={formData.email} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicPassword">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control type="password" placeholder="Password" name='password' value={formData.password} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="text-center mt-5">
                    <Button className="mx-2 px-2" variant="danger" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="mx-2 px-2" variant="success" type="submit">
                        Login
                    </Button>
                </Form.Group>
            </Form>
        </Modal>
    )
}