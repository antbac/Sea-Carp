import { useState } from "react";
import type { LoginRequest } from "../../models/LoginRequest";
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

function Login() {

  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
      Username: "",
      Password: "",
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const request: LoginRequest = {
      Username: formData.get('username') as string,
      Password: formData.get('password') as string,
    }
    setLoginRequest(request);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginRequest)
      })

      if (response.ok) {
        window.location.href = "/profiles";
      }
    }

    catch (error) {
      console.error("An error occurred when trying to register the account.", error);
    }
  }

  return (
    <Container>
          <h1>Logga in</h1>
      <Row xs={1} md={2}>
        <Col>

        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" placeholder='Username'></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder='Password'></Form.Control>
          </Form.Group>

          <Button type="submit">Register</Button>
        </Form>


        </Col>
        <Col>
        <h2>Your One-Stop Shop for Premium Sea Carp Fishing Gear</h2>

        <img src="/files/images/SeaCarpSimple.png" width="256" height="256" />

        <p>
          You're only one step away from exploring the best fishing gear, accessories, and tips for your next sea carp adventure. Log in to browse top-quality rods, reels, and baits, manage your cart and orders, and connect with fellow anglers in our vibrant community.
        </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;