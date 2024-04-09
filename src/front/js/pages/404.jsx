import React from "react";

export const Error404 = () => {
    return (
        <div className="m-5">
            <h1>404 Error</h1>
            <p className="zoom-area"><b>Sorry!</b> We couldn't find  what you are looking for :(</p>
            <section className="error-container">
                <span><span>4</span></span>
                <span>0</span>
                <span><span>4</span></span>
            </section>
            <div className="link-container">
                <a className="more-link">Go to Home</a>
            </div>
        </div>
    )
}