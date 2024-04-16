import React from 'react';

export const Spinner = ({ color = 'black' }) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column align-items-center">
                <div className="spinner-border" style={{color: color}} role="status"/>
                <div className="fs-1">Loading</div>
            </div>
        </div>
    );
}
