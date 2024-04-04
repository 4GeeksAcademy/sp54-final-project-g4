import React from "react";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

export const Profile = () => {

    return (
        <div className="container-fluid d-flex justify-content-inline m-3">
            <div >
                <Image src="https://placehold.co/100x100" roundedCircle className="mb-3" style={{ 'max-width': '16rem', 'min-width': '16rem' }} />
                <div class="card text-bg-secondary mt-3" style={{ 'max-width': '16rem' }}>
                    <Button variant="secondary" className="d-grid gap-2">Edit Profile</Button>
                    <div class="card-body bg-light mt-2">
                        This is some text within a card body.
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-between mx-3">
                <div >
                    <h1 className="mt-3">Nombre Usuario</h1>
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