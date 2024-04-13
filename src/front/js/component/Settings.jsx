import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal, Button, Form } from "react-bootstrap";
import { ModalPassword } from "./ModalPassword.jsx";
import { ModalConfirmPassword } from './ModalConfirmPassword.jsx';

export const Settings = ({ show = false, handleClose }) => {

    const { actions, store } = useContext(Context);
    const [showPasswordEdit, setShowPasswordEdit] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [infoProfile, setInfoProfile] = useState({
        "credits": 0,
        "email": "",
        "followers": [],
        "followings": [],
        "referral_code": "",
        "bio": "",
        "is_active": true,
        "username": "",
        
    });
    const params = useParams();
    const navigate = useNavigate()

    const handlePasswordConfirmation = (isCorrect) => {
        setIsPasswordCorrect(isCorrect);
    }

    const handleOpenConfirm = () => {
        setShowPasswordConfirm(true)
    }

    const handleCloseConfirm = () => {
        setShowPasswordConfirm(false)
    }

    const handleOpenPassword = () => {
        setShowPasswordEdit(true)
    }

    const handleClosePassword = () => {
        setShowPasswordEdit(false)
    }

    const handleInputChange = (event) => {
        setInfoProfile({ ...infoProfile, [event.target.name]: event.target.value })
    };

    const handleEditProfile = async () => {
        const editProfile = {
            "username": infoProfile.username,
            "email": infoProfile.email,
            "bio": infoProfile.bio,

        }

        if (!isPasswordCorrect) {
            return handleOpenConfirm();
        }

        const confirmUpdate = window.confirm("You will be logged out to update your user profile.")
        if (confirmUpdate) {
            const response = await actions.editUser(params.username, editProfile);
            const privacyBool = privacy == true ? "private" : "public"
            await actions.editSetting(infoProfile.id, "privacy", { "setting_value": privacyBool })
            alert(response.message)
            actions.signedOut()
            navigate("/")

        }
    }

    const handleIsActiveStatus = async () => {
        const confirmDelete = window.confirm("Are you sure you want to deactivate your account?")
        if (confirmDelete) {
            const response = await actions.editUser(infoProfile.username, { "is_active": infoProfile.is_active == true ? false : true })
            alert(response.message)
            window.location.reload(true)
        }
    }
    const getProfile = async () => {
        const response = await actions.getUser(params.username)
        const privacySetting = response.results.settings.find(obj => obj.setting_name == 'privacy');
        console.log(privacySetting)
        setInfoProfile(response.results)
        setPrivacy(privacySetting.setting_value == 'private' ? true : false)
    }

    useEffect(() => {
        getProfile()
    }, [])

    // Esto puede causar bugs, aun sin testear bien
    useEffect(() => {
        if (isPasswordCorrect) {
            handleEditProfile()
        }
    }, [isPasswordCorrect])


    return (
        <>
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
                                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" value={infoProfile.username} name="username" onChange={handleInputChange} />
                                    </div>
                                    <div className="my-3">
                                        <textarea className="form-control" placeholder="Change your bio!" id="exampleFormControlTextarea1" rows="3" value={infoProfile.bio} name="bio" onChange={handleInputChange} type="text"></textarea>
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
                                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={infoProfile.email} onChange={handleInputChange} name="email" />
                                        <label htmlFor="floatingInput">E-mail</label>
                                    </div>
                                    <div className="form-floating my-3 mx-3 ">
                                        <button type="btn" className="btn btn-sm btn-danger" onClick={handleOpenPassword}>
                                            Edit Password
                                        </button>
                                    </div>

                                    <div className="form-check form-switch mt-3">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={privacy} onChange={() => setPrivacy(!privacy)} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Credits Private</label>
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
            <ModalPassword username={infoProfile.username} show={showPasswordEdit} handleClose={handleClosePassword} />
            <ModalConfirmPassword show={showPasswordConfirm} handleClose={handleCloseConfirm} onPasswordConfirmed={handlePasswordConfirmation} />
        </>
    );
};
