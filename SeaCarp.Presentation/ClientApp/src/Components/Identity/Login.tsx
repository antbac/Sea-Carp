import { useState } from "react";
import type { LoginRequest } from "../../models/LoginRequest";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ApiConfig } from "../../utils/ApiConfig";

function Login() {
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    Username: "",
    Password: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const request: LoginRequest = {
      Username: formData.get("username") as string,
      Password: formData.get("password") as string,
    };
    setLoginRequest(request);

    try {
      const response = await fetch(ApiConfig.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      if (response.ok) {
        window.location.href = "/products";
      }
    } catch (error) {
      console.error(
        "An error occurred when trying to register the account.",
        error
      );
    }
  };

  return (
    <>
      <h1>Logga in</h1>
      <Row>
        <Col md={5} lg={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                size="lg"
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                size="lg"
              ></Form.Control>
            </Form.Group>

            <Button type="submit">Log in</Button>
            <Button as="a" href="/register" className="mx-2" variant="">
              Register as a new user
            </Button>
          </Form>
        </Col>
        <Col>
          <h2>Your One-Stop Shop for Premium Sea Carp Fishing Gear</h2>

          <p className="m-3">
            <img
              className="float-start me-3"
              src="/src/assets/SeaCarpSimple.png"
              width="256"
              height="256"
            />
            You're only one step away from exploring the best fishing gear,
            accessories, and tips for your next sea carp adventure. Log in to
            browse top-quality rods, reels, and baits, manage your cart and
            orders, and connect with fellow anglers in our vibrant community.
          </p>
        </Col>
      </Row>
    </>
  );
}

export default Login;
