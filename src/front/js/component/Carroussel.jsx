import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// $ npm install react-multi-carousel --save (instalar)

export const Carroussel = () => {


    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 8
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    return (
        <div className="container">
            <Carousel responsive={responsive} >
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
                <div><img src="https://placehold.co/150x200" /></div>
            </Carousel>
        </div>
    )
}