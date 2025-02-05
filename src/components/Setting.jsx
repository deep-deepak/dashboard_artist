import React from 'react'
import Title from '../common/Title'
import { Form, FormGroup, FormControl, FormLabel, Button, Container } from 'react-bootstrap';

export default function Setting() {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("test")
    }

    return (
        <div>
            <Container>
                <Title title={"General settting"} />
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl type="text" placeholder="test event" />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Goal</FormLabel>
                        <FormControl type="number" placeholder="500000" />
                    </FormGroup>
                    <FormGroup className="submit_btn">
                        <Button variant="success" type="submit">
                            Save
                        </Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
}
