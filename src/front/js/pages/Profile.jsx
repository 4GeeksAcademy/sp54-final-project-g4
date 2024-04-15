import React, { useContext, useEffect, useState } from "react";
import { Settings } from "../component/Settings.jsx";
import { Navigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Image, Button } from 'react-bootstrap'

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
            <div className="container-fluid mt-5 m-3">
                <div className="row">
                    <div className="col-2 d-flex flex-column align-items-center">
                        <Image src={infoProfile.avatar_url} roundedCircle className="mb-3" style={{ 'maxWidth': '8rem', 'minWidth': '8rem' }} />
                        <div className="card text-bg-secondary mt-3" style={{ 'width': '12rem' }}>
                            {isSameUser ? (
                                <Button variant="secondary" className={isSameUser ? "d-grid gap-2" : "d-grid gap-2 disabled"} onClick={handleOpenSettings}>Edit Profile</Button>
                            ) : null}
                            <div className="card-body bg-light mt-2 text-dark">
                                {infoProfile.bio ?? 'Sin Biografia'}
                            </div>
                        </div>
                    </div>

                    <div className="col-9">
                        <div className="row">
                            <div className="col">
                                <h1 className="text-start m-0">{params.username} {infoProfile.is_active == false ?
                                    <span className="mx-2 text-danger fw-bold">Account deactivated</span>
                                    : ""}</h1>
                                {isSameUser || privacy == false ? (
                                    <p className="fw-bold fs-6 text-warning">credits {infoProfile.credits} <i className="fa-solid fa-coins ms-1"></i></p>
                                ) : null}
                                <div className="d-flex justify-content-inline mt-5">
                                    <h4 className="me-3">Followings {infoProfile.followers.length}</h4>
                                    <h4>Followers {infoProfile.followings.length}</h4>
                                </div>
                            </div>

                            <div className="col-1 d-flex justify-content-end">
                                <div>
                                    <Button
                                        className={!isSameUser ? "" : "disabled"}
                                        onClick={handleFollow}
                                        variant={isFollowing ? "outline-danger me-3" : "outline-success me-3"}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Settings show={show} handleClose={handleCloseSettings} />
                        <div className="row mt-4">
                            <div className="col-6">
                                <Review user={params.username} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}