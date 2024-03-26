import React, { useContext } from "react";
import { Context } from '../store/appContext'
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export const Navigation = () => {

  const { store, actions } = useContext(Context)

	const navigate = useNavigate()	

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="bg-gradient">
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
                Something else here
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
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav.Link href="#action2" className="text-light">Log in</Nav.Link>
          <Nav.Link href="#" className="text-light">
            Watchlist
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}