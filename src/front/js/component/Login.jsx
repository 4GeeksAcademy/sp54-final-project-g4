import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Button, Form, Modal } from 'react-bootstrap';
import { ModalForgotPassword } from "./ModalForgotPassword.jsx";

// https://www.aunitz.net/tip-18-botones-aceptar-cancelar-orden/
export const Login = ({ show = false }) => {

    const { store, actions } = useContext(Context)
    const [formData, setFormData] = useState({
        username_email: '',
        password: '',
    });
    const [forgotShow, setForgotShow] = useState(false)

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
        window.location.reload(true)
    }

    const handleSwitch = (e) => {
        e.preventDefault();
        setFormData({ username_email: '', password: '' })
        actions.showModalSignin(false)
        actions.showModalSignup(true)
    }

    const handleCancel = () => {
        actions.showModalSignin(false)
    }

    const forgotClose = () => {
        setForgotShow(false)
    }

    const forgotOpen = (e) => {
        e.preventDefault()
        setForgotShow(true)
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
                    {/* <div className="form-text">
                        <a href="#" onClick={(e) => forgotOpen(e)}>Forgot password</a>
                    </div> */}
                </Form.Group>

                <Form.Group className="text-center mt-5">
                    <p>You don't have an account? <a href='#' onClick={(e) => handleSwitch(e)}>Click here to register!</a></p>
                    <Button className="mx-2 px-2" variant="danger" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="mx-2 px-2" variant="success" type="submit">
                        Login
                    </Button>
                </Form.Group>
            </Form>
            <ModalForgotPassword show={forgotShow} handleClose={forgotClose} />
        </Modal>
    )
}