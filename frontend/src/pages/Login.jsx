import React from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import left from '../images/left.png';
import right from '../images/right.png';

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    let error = {}
    if (!username) {
      error.username = 'Empty input';
    }
    if (!password) {
      error.password = 'Empty input';
    }
    if (Object.keys(error).length) {
      setErrors(error);
      return;
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {username, password})
      .then(res => {
        if (res.data == 'invalid user') {
          setErrors({
            username: 'incorrect username or password',
            password: 'incorrect username or password'
          });
        } else {
          localStorage.setItem('token', res.data);
          setErrors({});
          navigate('/home');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      }); 
  };
  return  (
    <Container className='border rounded border-secondary border-5 mt-5 w-50 mx-auto position-relative'>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6}>
          <Form noValidate onSubmit={handleSubmit}>
            <img src={logo} style={{ maxWidth: '300px' }} className="text-center mb-4" alt="Logo"/>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isInvalid={errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
      <div className="text-center m-5">
        <Link to="/register">Don't have an account? Register</Link>
      </div>
      <img src={left} style={{ maxWidth: '100px' }} className="position-absolute bottom-0 start-0" alt="left"/>
      <img src={right} style={{ maxWidth: '100px' }} className="position-absolute bottom-0 end-0" alt="right"/>
    </Container>
  )
}

export default Login;