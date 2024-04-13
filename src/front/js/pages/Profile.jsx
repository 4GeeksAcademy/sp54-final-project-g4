import React, { useContext, useEffect, useState } from "react";
import { Settings } from "../component/Settings.jsx";
import { Navigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Image, Button } from 'react-bootstrap'


export const Profile = () => {
    const { actions, store } = useContext(Context);
    // useStates
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
    const [privacy, setPrivacy] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isSameUser, setIsSameUser] = useState(false)
    const [show, setShow] = useState(false)
    const params = useParams(); // esto es igual a : es lo que va dentro de Params 

    const handleOpenSettings = () => {
        setShow(true)
    }

    const handleCloseSettings = () => {
        setShow(false)
    }

    const getProfile = async () => {
        const response = await actions.getUser(params.username)
        const privacySetting = response.results.settings.find(obj => obj.setting_name == 'privacy');
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

    const debug_user = async () => {
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
    }, [isFollowing])

    return (
        !infoProfile ? <Navigate to='/404' /> :
            <div className="container-fluid d-flex justify-content-inline m-3">
                <div >
                    <Image src="https://placehold.co/100x100" roundedCircle className="mb-3" style={{ 'maxWidth': '16rem', 'minWidth': '16rem' }} />
                    <div className="card text-bg-secondary mt-3" style={{ 'maxWidth': '16rem' }}>
                        {isSameUser ? (
                            <Button variant="secondary" className={isSameUser ? "d-grid gap-2" : "d-grid gap-2 disabled"} onClick={handleOpenSettings}>Edit Profile</Button>
                        ) : null}
                        <div className="card-body bg-light mt-2 text-dark">
                            {infoProfile.bio}

                        </div>
                    </div>
                </div>
                <div className="container d-flex justify-content-between mx-3">
                    <div >
                        <h1 className="mt-3">{params.username} {infoProfile.is_active == false ?
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
                    <div >
                        <Button
                            className={!isSameUser ? "" : "disabled"}
                            onClick={debug_user}
                            variant={isFollowing ? "outline-danger me-3" : "outline-success me-3"}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>

                        {/* <Button className={!isSameUser ? "" : "disabled"} variant="secondary">Report</Button> */}
                    </div>
                </div>
                <Settings show={show} handleClose={handleCloseSettings} />
            </div>
    )
}