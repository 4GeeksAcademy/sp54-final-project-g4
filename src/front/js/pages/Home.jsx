import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';


export const Home = () => {

  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const handleSelect = (selectedIndex) => setIndex(selectedIndex);
  const handleSelect2 = (selectedIndex) => {
    setIndex2(selectedIndex);
  };


  return (
    <Container>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 1" />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 2" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 3" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 4" />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 5" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img src="https://placehold.co/700x300" className='d-block w-100' alt="Image 6" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Carousel activeIndex={index2} onSelect={ handleSelect2}>
        <Carousel.Item>
          <Container>
            <Row>
              <Col><img src="https://placehold.co/700x300" alt="Image 1" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 2" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 3" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 4" className="img-fluid" /></Col>
            </Row>
          </Container>
        </Carousel.Item>
        <Carousel.Item>
          <Container>
            <Row>
              <Col><img src="https://placehold.co/700x300" alt="Image 5" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 6" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 7" className="img-fluid" /></Col>
              <Col><img src="https://placehold.co/700x300" alt="Image 8" className="img-fluid" /></Col>
            </Row>
          </Container>
        </Carousel.Item>
        {/* Add more Carousel.Item for additional slides */}
      </Carousel>
    </Container>
  );
};
