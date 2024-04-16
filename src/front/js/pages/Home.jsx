import React, { useContext, useEffect, useState } from "react";
import { Carousel } from 'react-bootstrap';
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from '../component/Spinner.jsx'


export const Home = () => {
  const { actions, store } = useContext(Context)
  const [index, setIndex] = useState(0);
  const [movieList, setMovieList] = useState([]);
  const [miniMovieList1, setMiniMovieList1] = useState([]);
  const [miniMovieList2, setMiniMovieList2] = useState([]);
  const [indexSecondary, setIndexSecondary] = useState(0);

  const navigate = useNavigate()

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
    setIndexSecondary(Math.floor(selectedIndex / 4))
  };

  const getMovies = async () => {
    const response = await actions.getMovies()
    const movies = response.results.slice(-8)
    setMovieList(movies)
    movies.length > 0 && setMiniMovieList1(movies.slice(0, 4))
    movies.length > 4 && setMiniMovieList2(movies.slice(4, 8))
    console.log(movies.length)

  }

  const handleSelect2 = (selectedIndex) => {
    setIndexSecondary(selectedIndex)
    setIndex(Math.floor(selectedIndex * 4))
  };

  useEffect(() => {
    getMovies()
  }, [])

  return (
    movieList.length < 1 ? <Spinner color='grey'/> :
    <div className="bg-stars py-5">
      <Carousel interval={10000} activeIndex={index} onSelect={handleSelect} className="container" style={{ maxWidth: '1500px', maxHeight: '450px' }}>
        {movieList.map((movie, index) => (
          <Carousel.Item key={index} >
            <img src={movie.cover_url ?? 'https://placehold.co/800x300'} style={{ height: "450px" }} onClick={() => navigate('/movie/' + movie.id)} className='d-block w-100' />
            <Carousel.Caption className="text-dark">
              <h3>{movie.title}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>


      <Carousel interval={null} activeIndex={indexSecondary} onSelect={handleSelect2} className="container" style={{ maxWidth: '1500px' }}>
        {miniMovieList1.length > 0 &&
          <Carousel.Item>
            <div className="d-flex justify-content-center">
              {miniMovieList1.map((movie, index) => (
                <span><img key={index} src={movie.cover_url ?? 'https://placehold.co/800x300'} className="m-3" onClick={() => handleSelect(index)} style={{ width: "300px", height: "200px" }} /></span>
              ))}
            </div>
          </Carousel.Item>}
        {miniMovieList2.length > 0 && <Carousel.Item >
          <div className="d-flex justify-content-center">
            {miniMovieList2.map((movie, index) => (
              <span><img key={index} src={movie.cover_url ?? 'https://placehold.co/800x300'} className="m-3" onClick={() => handleSelect(index + 4)} style={{ width: "300px", height: "200px" }} /></span>
            ))}
          </div>
        </Carousel.Item>}
      </Carousel>

    </div>
  );
}