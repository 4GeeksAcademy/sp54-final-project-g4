import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Image, Button } from 'react-bootstrap'


export const Profile = () => {
    const { actions, store } = useContext(Context);
    // useStates
    const [currentUser, setCurrentUser] = useState(null)
    const [infoProfile, setInfoProfile] = useState(null)
    const [isSameUser, setIsSameUser] = useState(false)
    const params = useParams(); // esto es igual a : es lo que va dentro de Params 
    const getCurrentUser = async () => {
        if (localStorage.getItem('access_token')) {
            setCurrentUser(await actions.getUserLoggedIn())
        } 

    }


    const getProfile = async () => {
        setInfoProfile(await actions.getUser(params.username))
    }

    const checkIsSameUser = () => {
        if(currentUser.results.username.toLowerCase() == params.username.toLowerCase()){
            setIsSameUser(true)
        }
    }

    useEffect(() => {
        getCurrentUser()
        getProfile()
        checkIsSameUser()
    }, [])



    return (
        <div className="container-fluid d-flex justify-content-inline m-3">
            <div >
                <Image src="https://placehold.co/100x100" roundedCircle className="mb-3" style={{ 'max-width': '16rem', 'min-width': '16rem' }} />
                <div className="card text-bg-secondary mt-3" style={{ 'max-width': '16rem' }}>
                    <Button variant="secondary" className={isSameUser ? "d-grid gap-2" : "d-grid gap-2 disabled"}>Edit Profile</Button>
                    <div className="card-body bg-light mt-2 text-dark">
                        {infoProfile ? infoProfile.results.username : "" }
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-between mx-3">
                <div >
                    <h1 className="mt-3">{params.username}</h1>
                    <p>0 creditos</p>
                    <div className="d-flex justify-content-inline mt-5">
                        <h4 className="me-3">0 Following</h4>
                        <h4>0 Followers</h4>
                    </div>
                </div>
                <div >
                    <Button variant="outline-success me-3">Follow</Button>
                    <Button variant="secondary">Report</Button>
                </div>
            </div>
        </div>
    )
}