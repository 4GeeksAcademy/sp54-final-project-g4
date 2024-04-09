import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Button, Form, Modal } from 'react-bootstrap';

export const Login = ({ show = false }) => {

    const { store, actions } = useContext(Context)
    const [formData, setFormData] = useState({
        username_email: '',
        password: '',
    });

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let dataTobeSent = {
            username: null,
            email: null,
            password: null,
        };
        formData.username_email.includes('@') ?
            dataTobeSent = { email: formData.username_email, password: formData.password } :
            dataTobeSent = { username: formData.username_email, password: formData.password }
        const response = await actions.login(dataTobeSent)
        response ? alert(response) : alert("Credentials are invalid!")
        setFormData({ username_email: '', password: '' })
        actions.showModalSignin(false);
    }

    const handleCancel = () => {
        actions.showModalSignin(false)
    }

    return (
        <Modal show={store.showModalSignin}>
            <Form onSubmit={handleSubmit} className="m-3">
                <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Username or address</Form.Label>
                    <Form.Control type="text" placeholder="Enter username or email" name='username_email' value={formData.username_email} onChange={(e) => handleInputChange(e)} required />
                </Form.Group>

                <Form.Group className="my-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
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