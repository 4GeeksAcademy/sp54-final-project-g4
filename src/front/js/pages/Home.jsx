import React, { useContext, useState } from "react";
import { Carousel } from 'react-bootstrap';

export const Home = () => {
  const [index, setIndex] = useState(0);
  const [indexSecondary, setIndexSecondary] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
    setIndexSecondary(Math.floor(selectedIndex / 4))
  };

  const handleSelect2 = (selectedIndex) => {
    setIndexSecondary(selectedIndex)
    setIndex(Math.floor(selectedIndex * 4))
  };

  const handleClick = (selectedIndex) => {
    // Logica
  };

  return (
    <div className="bg-dark">
      <Carousel interval={10000} activeIndex={index} onSelect={handleSelect} className="container" style={{ maxWidth: '1500px' }}>
        <Carousel.Item >
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Contact List</h3>
            <p>Trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/contact-list-context">4GeeksAcademy "Contact List"</a>.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Personajes</h3>
            <p>Información sobre los personajes de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Planetas</h3>
            <p>Información sobre los planetas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Cacatuas</h3>
            <p>Información sobre las cacatuas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Cacatuas</h3>
            <p>Información sobre las cacatuas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Cacatuas</h3>
            <p>Información sobre las cacatuas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Cacatuas</h3>
            <p>Información sobre las cacatuas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='https://placehold.co/800x300' onClick={() => handleClick(index)} className='d-block w-100' />
          <Carousel.Caption className="text-dark">
            <h3>Cacatuas</h3>
            <p>Información sobre las cacatuas de StarWars.</p>
            <p>Parte del trabajo de <a href="https://4geeks.com/syllabus/spain-fs-pt-54/project/starwars-blog-reading-list">4GeeksAcademy "Star Wars"</a></p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>


      <Carousel interval={null} activeIndex={indexSecondary} onSelect={handleSelect2} className="container" style={{ maxWidth: '1500px' }}>
        <Carousel.Item >
          <div className="d-flex justify-content-center">
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(0)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(1)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(2)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(3)} style={{ width: "300px", height: "200px" }} /></span>
          </div>
        </Carousel.Item>
        <Carousel.Item >
          <div className="d-flex justify-content-center">
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(4)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(5)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(6)} style={{ width: "300px", height: "200px" }} /></span>
            <span><img src='https://placehold.co/800x300' className="m-3" onClick={() => handleSelect(7)} style={{ width: "300px", height: "200px" }} /></span>
          </div>
        </Carousel.Item>
      </Carousel>

    </div>
  );
}