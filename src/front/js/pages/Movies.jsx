import React, {useContext, useState, useEffect} from "react";
import { Context } from '../store/appContext.js'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";


export const Movies = () => {

    const navigate = useNavigate()
    const { store, actions } = useContext(Context)
    const [movieList, setMovieList] = useState([{
        "title" : "",
        "cover_url" : "",
 
    }])


    const getMovieList = async () => {
        const response = await actions.getMovies()
        setMovieList(response.results)
    }

    useEffect(() => {         
        getMovieList()                           
    }, [])



    return (
        <div className="bg-stars">

            <div className="container movie-center">
                <div className="row d-flex align-item-strech ">
                    {movieList.map((peli, index)=>(
                        <div className=" col-3 m-0 p-0" key={index}>
                            <Card onClick={()=> navigate('/movie/' + peli.id)} className="card-shadow m-5" style={{ width: '15rem'}}>
                                <Card.Img variant="top" src={peli.cover_url ?? "https://placehold.co/400x600"} />
                                <Card.Body  className="bg-gradient bg-dark rounded-bottom" >
                                    <Card.Title className="text-truncate text-white">
                                    
                                            {peli.title}
                        
                                    </Card.Title>                               
                                    {/* <Button variant="primary">add to my Watchlist!</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}