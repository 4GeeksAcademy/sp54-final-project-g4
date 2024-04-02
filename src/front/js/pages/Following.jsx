import React from "react"
import { NavAndTab } from "../component/NavAndTab.jsx";
import Image from 'react-bootstrap/Image'


export const Followings = () => {
    return (
        <div className="container">
            <NavAndTab />
            <div className="mt-5">
                <div className="container d-flex justify-content-center">
                    <div className="card mb-3" style={{ width: "30rem" }}>
                        <div className="row">
                            <div className="card-body d-flex align-items-center justify-content-around py-1 px-3">
                                <Image className="col-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuSY8NpB90K1lOOhTXTqezluJyp7phBe5zfw&usqp=CAU" roundedCircle style={{ maxWidth: '4rem', maxHeight: '4rem' }} />
                                <h5 className="card-title col m-0 text-nowrap text-truncate mx-3">followings</h5>
                                <div className="button text-center col-2 mx-2">
                                    <button className="btn btn-warning btn-sm text-light ">Unfollow</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div>
    )
}