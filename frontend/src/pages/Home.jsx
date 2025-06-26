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
        console.log('Searching for:', query);
        axios.get('http://127.0.0.1:8000/users', { 
            params: { query }
        })
        .then(res => {
            setUsers(res.data);
        })
        .catch(error => {
            console.error(error);
        });
    };
    console.log(users);
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
        <Container>
            <Row>
                {users.map((user, index) => (
                    <Col key={index} sm={4}>
                        <Card className="m-3">
                            <Card.Body>
                                <Card.Title dangerouslySetInnerHTML={{ __html: user }} />
                                <Button variant="primary">Add contact</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {/* <div class="card-title h5"><img src="x" onError={() => alert(1)} /></div> */}
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