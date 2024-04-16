import React, { useContext, useEffect, useState } from "react";
import { Settings } from "../component/Settings.jsx";
import { Navigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { MD5 } from 'crypto-js';
import { Review } from "../component/Review.jsx";


export const Profile = () => {
    const { actions, store } = useContext(Context);

    // useStates
    const [privacy, setPrivacy] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isSameUser, setIsSameUser] = useState(false)
    const [show, setShow] = useState(false)
    const [currentUserInfo, setCurrentUserInfo] = useState()
    const [infoProfile, setInfoProfile] = useState({
        "credits": 0,
        "email": "",
        "followers": [],
        "followings": [],
        "is_active": true,
        "username": "",
        "settings": [],
        "bio": ""
    })

    // Declaraciones
    const params = useParams(); // esto es igual a : es lo que va dentro de Params 

    // Funciones
    const gravatar = () => {

    }


    const handleOpenSettings = () => {
        setShow(true)
    }

    const handleCloseSettings = () => {
        setShow(false)
    }

    const getProfile = async () => {
        const response = await actions.getUser(params.username)
        const privacySetting = response.results.settings.find(obj => obj.setting_name == 'privacy');
        response.results.email = MD5(response.results.email.toLowerCase()).toString();
        response.results.avatar_url = "https://www.gravatar.com/avatar/" + response.results.email;
        setInfoProfile(response.results)
        setPrivacy(privacySetting.setting_value == 'private' ? true : false)
        if (localStorage.getItem('access_token')) {
            const currentUser = await actions.getUserLoggedIn()
            setCurrentUserInfo(currentUser.results)
            setIsFollowing(response.results.followings.some(follower => follower.follower_id == currentUser.results.id))
            if (currentUser.results.username.toLowerCase() == params.username.toLowerCase()) {
                setIsSameUser(true)
            }
        }
    }

    const handleFollow = async () => {
        if (currentUserInfo) {
            if (!isFollowing) {
                actions.followUser(currentUserInfo.id, infoProfile.id)
                setIsFollowing(true)
            } else {
                actions.unfollowUser(currentUserInfo.id, infoProfile.id)
                setIsFollowing(false)
            }
        } else {
            actions.showModalSignin(true)
        }

    }

    useEffect(() => {
        getProfile()
    }, [])

    useEffect(() => {
        getProfile()
    }, [isFollowing, params.username])

    return (
        !infoProfile ? <Navigate to='/404' /> :
            <Container fluid className="bg-stars">
                <Row className="m-0">
                    {/* Perfil Izquierdo */}
                    <Col md={3} className="d-flex flex-column align-items-center profile-left py-5">
                        <Image src={infoProfile.avatar_url} roundedCircle className="mb-3" style={{width: "50%"}} />
                        <div className="card text-bg-secondary mt-3" >
                            {isSameUser && (
                                <Button variant="secondary" className="d-grid gap-2" onClick={handleOpenSettings}>
                                    Edit Profile
                                </Button>
                            )}
                            <div className="card-body bg-light mt-2 text-dark">
                                {infoProfile.bio ?? 'Sin Biografia'}
                            </div>
                        </div>
                    </Col>

                    {/* Perfil Derecho */}
                    <Col md={9} className="profile-right py-5">
                        <Row>
                                <Col md={10} className="bg-opacity-rounded">
                                    <h1 className="text-start m-0 txt-shadow">
                                        {params.username} {infoProfile.is_active === false && (
                                            <span className="mx-2 text-danger fw-bold">Account deactivated</span>
                                        )}
                                    </h1>
                                    {(isSameUser || !privacy) && (
                                        <p className="fw-bold fs-6 text-primary txt-shadow">
                                            credits {infoProfile.credits} <i className="fa-solid fa-coins ms-1"></i>
                                        </p>
                                    )}
                                    <div className="d-flex justify-content-inline my-5">
                                        <h4 className="me-3 txt-shadow">Followings {infoProfile.followers.length}</h4>
                                        <h4 className="txt-shadow">Followers {infoProfile.followings.length}</h4>
                                    </div>
                                    <div className="mt-4">
                                        <Review user={params.username} />
                                    </div>
                                </Col>
                                <Col md={2} className="d-flex justify-content-end pe-5">
                                    <div>
                                        <Button
                                            className={!isSameUser ? "" : "disabled"}
                                            onClick={handleFollow}
                                            variant={isFollowing ? "danger me-3" : "success me-3"}
                                        >
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </Button>
                                    </div>
                                </Col>
                        </Row>

                        {/* Botón de Seguir/Dejar de Seguir */}
                        <Settings show={show} handleClose={handleCloseSettings} />
                    </Col>
                </Row>
            </Container>
    );
}