import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

export default function Account() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail, logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
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

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (changingEmail) {
      promises.push(updateEmail(emailRef.current.value));
      setChangingEmail(false);
    }
    if (changingPassword) {
      promises.push(updatePassword(passwordRef.current.value));
      setChangingPassword(false);
    }

    Promise.all(promises)
      .then(() => {
        handleLogout();
      })
      .catch((err) => {
        setError(err.code.replace("auth/", ""));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleEmailChange() {
    setChangingEmail(true);
  }

  function handlePasswordChange() {
    setChangingPassword(true);
  }

  return (
    <>
      <NavigationBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Account Preferences</h2>
              {/* if we have an error then render alert */}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser.email}
                    required
                    disabled={changingPassword}
                    onChange={handleEmailChange}
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                    disabled={changingEmail}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                    disabled={changingEmail}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
                <Button
                  disabled={loading}
                  className="w-100 container my-3"
                  type="submit"
                >
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
