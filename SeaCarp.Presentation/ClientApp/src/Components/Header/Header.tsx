import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { isLoggedIn } from "../../utils/Helpers";

function Header() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  }

  return (
    <Container as={"header"}>
      <Row>
        <Col>
          <Navbar expand="sm" variant="dark">
            <Container>
              <Navbar.Brand href="/">
                <img
                  className="d-sm-inline-block"
                  src="/src/assets/SeaCarpLogo.png"
                  title="Sea Carp"
                />
                Sea Carp
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav ms-auto">
                <Form className="d-flex" onSubmit={handleSubmit}>
                  <Form.Control
                    type="search"
                    name="search"
                    placeholder="Search"
                    className="me-2"
                  />
                </Form>
                <Nav className="ms-auto">
                  {!isLoggedIn() ? (
                    <>
                      <Nav.Link href="/register">Register</Nav.Link>
                      <Nav.Link href="/login">Login</Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link href="/profile">Profile</Nav.Link>
                      <Nav.Link href="/logout">Logout</Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
