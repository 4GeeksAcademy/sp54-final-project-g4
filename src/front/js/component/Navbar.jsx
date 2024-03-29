import React, { useContext } from "react";
import { Context } from '../store/appContext'
import { Link, useNavigate } from "react-router-dom";
import { Signup } from "./Signup.jsx";
import { Login } from "./Login.jsx";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



export const Navigation = () => {

  const { store, actions } = useContext(Context)

  const navigate = useNavigate()

  const handleProfile = async () => {
    navigate("/profile/" + await actions.getUserLoggedIn())
  }


  const handleSignout = async () => {
    actions.signedOut()
    navigate("/")
  }

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="bg-gradient p-0">
      <Container fluid>
        <Navbar.Brand href="#home" >
          <img
            alt=""
            src="/img/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Star Trail
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse >
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1" >Home</Nav.Link>
            <NavDropdown title="Menu" >
              <NavDropdown.Item href="#action3">Series</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Movies
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                {store.isLogin ?
                  <p onClick={() => handleSignout()} className="p-0">Logout</p>
                  :
                  <p onClick={() => actions.showModalSignup(true)} className="p-0">Sign up</p>
                }
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success me-2">Search</Button>
          </Form>

          <Nav>
            {store.isLogin ?
              <p onClick={() => handleProfile()} className="text-light mt-3">Profile</p>
              :
              <p onClick={() => actions.showModalSignin(true)} className="text-light mt-3">Login</p>
            }
          </Nav>

          <Nav.Link href="#" className="text-light">
            Watchlist
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
      <Login />
      <Signup />
    </Navbar>
  );
}