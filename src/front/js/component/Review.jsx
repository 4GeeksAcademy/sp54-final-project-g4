import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export const Review = () => {

    return (
        <div >

            <Card className="col-lg-6 col-sm-3 col-md-6 bg-light m-3">
                <Card.Header className="d-flex justify-content-between">
                    <p><b>El Peluche </b> <i className="fas fa-star" style={{"color": "#FFD43B"}}></i>2/5</p>
                    <i className="fas fa-times text-secondary"></i>
                </Card.Header>
                <Card.Body>
                    <Card.Title>Muy mala</Card.Title>
                    <Card.Text>
                        No me ha gustado la peli.
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted d-flex justify-content-between">
                    <p>2 days ago</p>
                    <i className="fas fa-comments"></i>
                </Card.Footer>
            </Card>
        </div>

    )
}