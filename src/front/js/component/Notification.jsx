import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext.js'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge';
import ToastContainer from 'react-bootstrap/ToastContainer';

export const Notification = () => {
    const [showA, setShowA] = useState(false);
    const { store, actions } = useContext(Context)
    const [infoProfile, setInfoProfile] = useState({
        "notifications": [],
        "is_active": true,
        "username": ""
    
})

    const toggleShowA = () => setShowA(!showA);

    const deleteNoti = async (notification_id) => {
        actions.deleteNotification(infoProfile.id, notification_id)
        getProfile()
    }  

    const getProfile = async () => {         
        const response = await actions.getUserLoggedIn()  
        const response2 = await actions.getUser(response.results.username)  
   
        setInfoProfile(response2.results)             
    }

    useEffect(() => {         
        getProfile()                   
    }, [])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        // Ejemplo de formato: DD/MM/YYYY HH:MM:SS
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        return formattedDate;
    };

    return (
        <Row>
            <Col md={8} className=" mb-2">
                <Button onClick={toggleShowA} className="d-flex mt-2">
                    <i className="fas fa-bell me-1"></i> <Badge bg="secondary">{infoProfile.notifications.length}</Badge>
                    <span className="visually-hidden">unread messages</span>
                </Button>
                <ToastContainer position="top-end" className="p-3 mt-5" style={{ zIndex: 1 }}>
                    {infoProfile.notifications && infoProfile.notifications.map((noti, index)=>(

                        <Toast key={index} show={showA} onClose={() => deleteNoti(noti.id)}>
                            <Toast.Header>
                                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                                <strong className="me-auto">{infoProfile.username}</strong>
                                <small>{formatDate(noti.timestamp)}</small>
                            </Toast.Header>
                            <Toast.Body className="d-flex justify-content-between">{noti.notification_text}</Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>

            </Col>
        </Row>
    );
}
