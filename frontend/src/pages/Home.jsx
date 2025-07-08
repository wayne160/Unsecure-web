import React from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";

const Home = () => {
    const navigate = useNavigate();
    const [query, setQuery] = React.useState('');
    const [users, setUsers] = React.useState([]);
    React.useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`${process.env.BACKEND_URL}/users`, {
            params: { query }
        })
        .then(res => {
            setUsers(res.data);
        })
        .catch(error => {
            console.error(error);
        });
    };
    return (<>
        <Container className="mt-4">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button
                        variant="outline-success"
                        type="submit"
                        >
                        Search
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
        {console.log(users)}
        <Container>
            <Row>
                {users.map((user, index) => (
                    <Col key={index} sm={4}>
                        <Card className="m-3">
                            <Card.Body className="text-center">
                                <div className="m-3">{user[1]}</div>
                                <Button variant="primary" onClick={(() => {
                                    navigate(`/message/${user[0]}/${user[1]}`);
                                })}>Send message</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        <Button onClick={() => {
            localStorage.setItem('token', null)
            navigate('/login');
        }}>
            logout
        </Button>
    </>)
}

export default Home;