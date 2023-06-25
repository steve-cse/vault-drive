import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
export default function NavigationBar() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    setError("");

    try {
      await logout();
      sessionStorage.setItem("myData", ""); //erase persistent state
      window.open("/login", "_top");
    } catch {
      setError("Failed to log out");
    }
  }
  return (
    <>
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="logo"
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Vault Drive
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/")}>Central</Nav.Link>
              <Nav.Link onClick={() => navigate("/management")}>
                Management
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ecdh")}>ECDH</Nav.Link>
              <Nav.Link onClick={() => navigate("/keygen")}>Get Key Pair</Nav.Link>
              <NavDropdown title="Account">
                <NavDropdown.Item>
                  <div className="p-2">{currentUser.email}</div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <div className="w-100 text-center mt-2">
                  <Button onClick={handleLogout}>Log Out</Button>
                </div>
              </NavDropdown>
             
             
              <Nav.Link onClick={() => navigate("/about")}>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
}
