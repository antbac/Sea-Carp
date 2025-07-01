import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Header() {
  return (
    <Container as={"header"}>
      <Row>
        <Col>
          <Navbar expand="sm" className="" variant="dark">
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
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
                <Nav className="me-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/register">
                      Register
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
                  </NavDropdown>
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
