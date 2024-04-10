import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";

export const Settings = ({ show, handleClose }) => {

    const { actions, store } = useContext(Context);
    const [infoProfile, setInfoProfile] = useState({
        "credits": 0,
        "email": "",
        "followers": [],
        "followings": [],
        "referral_code": "",
        "bio":"",
        "is_active": true,
        "username": ""

    });
    const params = useParams();

    const handleEditProfile = async () => {
        const editProfile = {
            "username": infoProfile.username,
            "email": infoProfile.email,
            "bio": infoProfile.bio 
        }
        try {
            const response = await actions.editUser(params.username, editProfile)
            console.log('Perfil updated:', response);
            setInfoProfile(response.results)
        } catch (error) {
            console.error('Error al actualizar el perfil')
        }
    }

    const handleIsActiveStatus =  async () => {
        const confirmDelete = window.confirm("Are you sure you want to deactivate your account?")
        if(confirmDelete){
            const response = await actions.editUser(params.username, {"is_active": infoProfile.is_active == true ? false : true})
            alert(response.message)
            window.location.reload(true)
        }
    }
    const getProfile = async () => {
        const response = await actions.getUser(params.username)
        setInfoProfile(response.results)
        console.log(response.results);
    }

    useEffect(() => {
        getProfile()
    }, [])


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="accordion accordion-flush" id="accordionFlushExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                Edit profile
                            </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                                <div className="input-group flex-nowrap">
                                    <span className="input-group-text" id="addon-wrapping">@</span>
                                    <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" value={params.username}/>
                                </div>
                                <div className="my-3">
                                    <textarea className="form-control" placeholder="Change your bio!" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                Privacy
                            </button>
                        </h2>
                        <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                                <div className="form-floating">
                                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                    <label for="floatingInput">E-mail</label>
                                </div>
                                <div className="form-floating mt-2 ">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                    <label for="floatingPassword">Password</label>
                                </div>

                                <div className="form-check form-switch mt-3">
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                    <label className="form-check-label" for="flexSwitchCheckDefault">Private Account</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                Referral Code
                            </button>
                        </h2>
                        <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                                <div className="input-group flex-nowrap">
                                    <input type="text" className="form-control" disabled placeholder={infoProfile.referral_code} aria-label="referral_code" aria-describedby="addon-wrapping" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        {infoProfile.is_active == true ? 
                        <Button className="text-light text-center btn-danger btn-sm" onClick={() => handleIsActiveStatus()}>Delete Account</Button> : 
                        <Button className="text-light text-center btn-succesful btn-sm" onClick={() => handleIsActiveStatus()}>Reactivate Account</Button>}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditProfile}>Save changes</button>
            </Modal.Footer>
        </Modal>
    );
};
