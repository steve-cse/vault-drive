import React from 'react'
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
export default function Login() {
  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login to Vault Drive 💽</h2>
              <Form>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
                <Button className="w-100 container my-3" type="submit">
                  Login
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <p>Forgot Password?</p>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Need an account? <p>Sign Up</p>
          </div>
        </div>
      </Container>
    </>
  )
}
