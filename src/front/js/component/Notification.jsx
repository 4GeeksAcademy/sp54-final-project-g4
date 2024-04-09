import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge';
import ToastContainer from 'react-bootstrap/ToastContainer';

export const Notification = () => {
    const [showA, setShowA] = useState(false);

    const toggleShowA = () => setShowA(!showA);


    return (
        <Row>
            <Col md={8} className=" mb-2">
                <Button onClick={toggleShowA} className="d-flex mt-2">
                    <i className="fas fa-bell me-1"></i> <Badge bg="secondary">0</Badge>
                    <span className="visually-hidden">unread messages</span>
                </Button>
                <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
                    <Toast show={showA} onClose={toggleShowA}>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
                    </Toast>
                </ToastContainer>



            </Col>
        </Row>
    );
}
