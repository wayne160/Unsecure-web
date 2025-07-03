import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const Message = () => {
    const user2 = useParams()['userId'];
    const username = useParams()['username'];
    const [ user1, setUser1 ] = React.useState(0);
    const [ content, setContent ] = React.useState('');
    const [ messages, setMessages ] = React.useState([]);
    const messagesEndRef = React.useRef(null);
    const start = React.useRef(true);

    React.useEffect(() => {
        axios.get('http://127.0.0.1:8000/user', {
            params: { 'token':localStorage.getItem('token') }
        })
        .then((res) => {
            setUser1(res.data);
        })
    }, [])
    React.useEffect(() => {
        if (!user1 || !user2) return;
        const interval = setInterval(() => {
        axios.get('http://localhost:8000/messages', {
            params: { sender_id: user1, receiver_id: user2 }
        })
            .then((res) => {
                setMessages(res.data);
        });
        }, 1000); 

        return () => clearInterval(interval); 
    }, [user1, content]);
    React.useEffect(() => {
        if (start.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            start.current = false;
        }
    }, [messages]);
    const handleSendMessage = () => {
        axios.post('http://127.0.0.1:8000/send', {
            content,
            sender_id: user1,
            receiver_id: user2
        })
        .then((res) => {
            setContent('');
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        })
    }
    return (<>
        <Container fluid className="vh-100 d-flex flex-column">
            <Card className="flex-grow-1 d-flex flex-column">
                <Card.Header>
                    {username}
                </Card.Header>
                <Card.Body style={{height: '100px', flexDirection: 'column-reverse'}}className="flex-grow-1 overflow-auto p-3">
                    {
                        messages.map((message, key) => (
                            <div key={key}>
                                <div className="text-center">{message[1].slice(0, -7)}</div>
                                <div className={`mb-3 d-flex ${message[2] === user1 ? 'justify-content-end' : 'justify-content-start'}`}
>
                                    <div className="border border-primary p-2 rounded">
                                        {message[0]}
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                    <div ref={messagesEndRef} />
                </Card.Body>
                <Card.Footer>
                    <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                        <Row>
                            <Col>
                                <Form.Control
                                type="text"
                                placeholder="Enter message"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Button
                                    type="submit"
                                >
                                Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Footer>
            </Card>
        </Container>
    </>)
}

export default Message;