import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import type { AccountRegistrationRequest } from '../../models/AccountRegistrationRequest';

function Register() {

  const [registrationRequest, setRegistrationRequest] = useState<AccountRegistrationRequest>({
    Username: "",
    Email: "",
    Password: "",
    Credits: 0
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const request: AccountRegistrationRequest = {
      Username: formData.get('username') as string,
      Email: formData.get('email') as string,
      Password: formData.get('password') as string,
      Credits: 100
    }
    setRegistrationRequest(request);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationRequest)
      })

      if (response.ok) {
        window.location.href = "/identity/login";
      }
    }

    catch (error) {
      console.error("An error occurred when trying to register the account.", error);
    }
  }

  return (
    <Container>
          <h1>Register</h1>
      <Row xs={1} md={2}>
        <Col>
        <h2>Create a new account.</h2>


        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" placeholder='Username'></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" placeholder='Email'></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder='Password'></Form.Control>
          </Form.Group>

          <Button type="submit">Register</Button>
        </Form>


        </Col>
        <Col>
        <h2>Join the #1 Community for Sea Carp Gear, Tips & More</h2>
        </Col>
      </Row>
    </Container>
  )
}

export default Register