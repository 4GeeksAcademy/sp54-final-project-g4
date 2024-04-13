import React, {useContext, useState, useEffect} from "react";
import { Context } from '../store/appContext.js'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";


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
        console.log(response)
    }

    useEffect(() => {         
        getMovieList()                           
    }, [])



    return (
        <div className="container">
            <div className="row d-flex align-item-strech">
                {movieList.map((peli, index)=>(
                    <div className="col-3" key={index}>
                        <Card onClick={()=> navigate('/movie/' + peli.id)} className="m-5" style={{ width: '18rem'}}>
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
    )
}