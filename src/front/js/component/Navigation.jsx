import React, { useContext } from "react";
import { Context } from '../store/appContext.js'
import { Link, useNavigate } from "react-router-dom";
import { Signup } from "./Signup.jsx";
import { Login } from "./Login.jsx";
import startraillogo from "../../img/Star-trail.png"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Notification } from "./Notification.jsx";


export const Navigation = () => {

  const { store, actions } = useContext(Context)

  const navigate = useNavigate()

  const handleProfile = async () => {
    const response = await actions.getUserLoggedIn()
    navigate("/profile/" + response.results.username)
  }

  const handleSignout = async () => {
    actions.signedOut()
    navigate("/")
  }

  // const search = () => {

  // }

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="bg-gradient p-0">
      <Container fluid>
        <Navbar.Brand href="/" >
          <img
            alt=""
            src={startraillogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Star Trail
        </Navbar.Brand>
        <Navbar.Collapse >
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/" >Home</Nav.Link>
            <Nav.Link href="/movies" >Movies</Nav.Link>
          </Nav>
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {/* <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button onClick={search} href="buscador" variant="outline-success me-2">Search</Button>
          </Form> */}
            <Nav.Link onClick={store.isLogin ? () => handleProfile() : () => actions.showModalSignin(true)} >{store.isLogin ? 'Profile' : 'Sign in'}</Nav.Link>
            <Nav.Link onClick={store.isLogin ? () => handleSignout() : () => actions.showModalSignup(true)} >{store.isLogin ? 'Log out' : 'Sign up'}</Nav.Link>
          </Nav>
          {store.isLogin && <Notification />}

        </Navbar.Collapse>
      </Container>
      <Login />
      <Signup />
    </Navbar>
  );
}