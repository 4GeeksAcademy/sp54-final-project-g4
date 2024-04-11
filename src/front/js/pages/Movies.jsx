import React, {useContext} from "react";
import { Context } from '../store/appContext.js'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export const Movies = () => {

    const { store, actions } = useContext(Context)

    return (
        <Card className="m-5" style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://placehold.co/400x600" />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </Card.Text>
                <Button variant="primary">add to my Watchlist!</Button>
            </Card.Body>
        </Card>
    )
}