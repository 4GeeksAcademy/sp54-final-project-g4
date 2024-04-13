import React from "react";
import Nav from 'react-bootstrap/Nav';


export const NavAndTab = () => {
    return (
        <Nav variant="tabs" className="d-flex justify-content-center">
          <Nav.Item>
            <Nav.Link href="/followers">Followers</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/followings">Followings</Nav.Link>
          </Nav.Item>
        </Nav>
      );
}