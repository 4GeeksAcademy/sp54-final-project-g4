import React from "react";
import { Card, Pagination, Container, Row, Col } from 'react-bootstrap';

export const Playlist = () => {
    return (
        <div className="container-fluid pb-3" style={{ background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))" }}>
            <Container className="d-flex">
                <Card className="bg-dark text-white rounded mt-4" style={{ width: '19rem', height: '25rem', position: 'relative', overflow: 'hidden' }}>
                    <Card.Img src="https://r3.abcimg.es/resizer/resizer.php?imagen=https%3A%2F%2Fs3.abcstatics.com%2Fmedia%2Fpeliculas%2F000%2F015%2F835%2Fstar-wars-episodio-ii-el-ataque-de-los-clones-1.jpg&nuevoancho=683&medio=abc" alt="Card image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Card.ImgOverlay className="text-center pt-5">
                        <Card.Title className="position-absolute bottom-0 start-50 translate-middle-x fs-4 text-center w-100 pb-4">Star Wars: Las guerras clon</Card.Title>
                    </Card.ImgOverlay>
                </Card>
                <h1 className="ms-5 text-light mt-4">Title</h1>
            </Container>

            <Row className="my-5">
                <Col xs={12} sm={6} md={4} className="mb-3">
                    <Card className="bg-dark text-white" style={{ width: '15rem', height: '18rem', overflow: 'hidden' }}>
                        <Card.Img src="https://r3.abcimg.es/resizer/resizer.php?imagen=https%3A%2F%2Fs3.abcstatics.com%2Fmedia%2Fpeliculas%2F000%2F015%2F835%2Fstar-wars-episodio-ii-el-ataque-de-los-clones-1.jpg&nuevoancho=683&medio=abc" alt="Card image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Card.ImgOverlay className="text-center pt-5">
                            <Card.Title className="position-absolute bottom-0 start-50 translate-middle-x fs-4 text-center w-100 pb-4">Star Wars: Las guerras clon</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                </Col>                
            </Row>

            <Pagination className="mt-3 justify-content-center">
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
            </Pagination> 
        </div>
    );
}
