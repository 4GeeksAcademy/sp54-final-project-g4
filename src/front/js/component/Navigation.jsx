import React, { useContext } from "react";
import { Context } from '../store/appContext.js'
import { Link, useNavigate } from "react-router-dom";
import { Signup } from "./Signup.jsx";
import { Login } from "./Login.jsx";

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

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="bg-gradient p-0">
      <Container fluid>
        <Navbar.Brand href="/" >
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
            <Nav.Link href="/" >Home</Nav.Link>
            <NavDropdown title="Menu" >
              <NavDropdown.Item href="series">Series</NavDropdown.Item>
              <NavDropdown.Item href="movies">
                Movies
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="watchlist">
                Watchlist
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
              <p onClick={() => actions.showModalSignin(true)} className="text-light mt-3">Login or</p>
            }
          </Nav>

          <Nav.Link href="#" className="text-light mx-2">
            {store.isLogin ?
              <p onClick={() => handleSignout()} className="p-0 mt-3">Logout</p>
              :
              <p onClick={() => actions.showModalSignup(true)} className="p-0 mt-3">Sign up</p>
            }
          </Nav.Link>
          {store.isLogin && <Notification />}
          
        </Navbar.Collapse>
      </Container>
      <Login />
      <Signup />
      
    </Navbar>
  );
}