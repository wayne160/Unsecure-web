# Web Vulnerability Demonstration

A deliberately insecure full-stack messaging application developed as a
cybersecurity project to demonstrate common web vulnerabilities, explain
how they work, and compare insecure implementations with safer
alternatives.

> **Important:** This project is intentionally vulnerable and is
> intended for educational use in a controlled environment only. Do not
> deploy the vulnerable version for real users or use the demonstrated
> techniques against systems without authorization.

## Project Overview

The application allows users to:

-   Register and log in
-   Search for other users
-   Send private messages
-   Access authenticated pages using a token

The project focuses on three security issues:

1.  **SQL Injection**
2.  **Token Validation Bypass / Improper Token Validation**
3.  **Network Eavesdropping over HTTP (MITM / Packet Sniffing)**

For each vulnerability, the project demonstrates the insecure
implementation, explains why it is vulnerable, and presents a
mitigation.

## Tech Stack

### Frontend

-   React.js
-   Bootstrap
-   Axios

### Backend

-   Python
-   Flask
-   Flask-CORS
-   PyJWT
-   MySQL Connector

### Database

-   MySQL / MariaDB
-   Hosted database used for the deployed version

### Security / Testing

-   Wireshark
-   Browser Developer Tools

## Architecture

``` text
┌──────────────────┐
│   React Frontend │
│                  │
│ Login / Register │
│ Search / Message │
└────────┬─────────┘
         │
         │ HTTP/HTTPS API requests
         ▼
┌──────────────────┐
│   Flask Backend  │
│                  │
│ Authentication   │
│ User APIs        │
│ Message APIs     │
└────────┬─────────┘
         │
         │ SQL queries / results
         ▼
┌──────────────────┐
│ MySQL / MariaDB  │
│                  │
│ users            │
│ messages         │
└──────────────────┘
```

## Vulnerabilities Demonstrated

### 1. SQL Injection

The intentionally vulnerable version constructs SQL statements by
directly inserting user-controlled input into query strings.

This demonstrates how malicious input can alter the intended SQL logic,
potentially causing authentication bypass or exposing information from
the database.

**Mitigation:** Use parameterized queries / prepared statements so that
user input is bound as data rather than interpreted as SQL syntax.

``` python
cursor.execute(
    "SELECT id, username FROM users WHERE username = %s AND password = %s",
    (username, password)
)
```

Passwords should also **not be stored in plaintext**. A production
application should use a dedicated password-hashing algorithm such as
bcrypt or Argon2 and verify the submitted password against the stored
hash.

### 2. Token Validation Bypass

The vulnerable frontend determines whether a user is logged in by
checking whether a value exists in `localStorage`. If the application
only checks for the presence of a token, an arbitrary string can satisfy
the client-side check.

**Mitigation:** Treat the browser as untrusted. Protected backend
endpoints must verify the authentication token before returning
protected data or performing protected actions. Invalid, modified, or
expired tokens should result in an unauthorized response.

Client-side route protection can improve the user experience, but it
must not be the security boundary.

### 3. HTTP Network Eavesdropping

When application traffic is transmitted over plain HTTP, request
contents can travel across the network without transport encryption. In
a controlled lab environment, packet-analysis tools such as Wireshark
can demonstrate the difference between readable HTTP traffic and
TLS-protected HTTPS traffic.

**Mitigation:** Deploy the application using HTTPS/TLS. With HTTPS,
application data is encrypted while travelling between the client and
the HTTPS endpoint, preventing a passive network observer from simply
reading the HTTP message body.

HTTPS protects data **in transit**; it does not provide end-to-end
encryption between messaging users and does not protect plaintext data
after it has been decrypted by the server or stored in the database.

## Project Structure

``` text
project/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env              # local only — do not commit
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env              # local configuration
│
└── README.md
```

## Local Setup

### Prerequisites

Install:

-   Python 3
-   Node.js and npm
-   MySQL/MariaDB

### Backend

From the backend directory:

``` bash
cd backend
pip install -r requirements.txt
python app.py
```

For local development, the Flask application runs on:

``` text
http://localhost:8000
```

A typical `requirements.txt` contains:

``` text
Flask
flask-cors
mysql-connector-python
PyJWT
python-dotenv
gunicorn
```

### Frontend

From the frontend directory:

``` bash
cd frontend
npm install
npm start
```

The React development server normally runs on:

``` text
http://localhost:3000
```

## Environment Variables

Do not hardcode database passwords or JWT signing secrets in source
code.

Example backend `.env`:

``` dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=replace_with_a_strong_secret
FRONTEND_URL=http://localhost:3000
```

Example frontend `.env`:

``` dotenv
REACT_APP_API_URL=http://localhost:8000
```

For production, `REACT_APP_API_URL` should point to the deployed backend
HTTPS URL.

> Never commit real credentials or signing secrets to Git. If a
> credential has previously been committed or publicly exposed, rotate
> it rather than only removing it from the latest version of the file.

## Production Deployment

The frontend and backend can be deployed separately:

``` text
React Frontend ──HTTPS──► Flask Backend ──► Hosted SQL Database
```

For a static React deployment:

``` bash
npm install && npm run build
```

For the Flask backend on a Linux hosting environment:

``` bash
gunicorn app:app
```

Production configuration should be supplied using the hosting provider's
environment-variable settings.

## Security Improvements

The secure version should apply several controls together:

-   Parameterize every SQL value.
-   Hash passwords using bcrypt or Argon2.
-   Validate authentication on the backend for every protected
    operation.
-   Give tokens an appropriate expiration time.
-   Do not trust `localStorage` merely because a value exists there.
-   Use HTTPS for all production traffic.
-   Keep credentials and signing secrets outside source control.
-   Restrict CORS to required frontend origins where appropriate.
-   Validate user input and return appropriate
    authentication/authorization errors.

## Learning Outcomes

This project demonstrates the difference between building functionality
that *works* and building functionality that is *secure*. Implementing
the vulnerable versions made it possible to observe how small design
decisions---such as concatenating SQL strings, trusting client-side
state, or using HTTP---can create significant security weaknesses.

The mitigations also demonstrate an important security principle:
security should be enforced at the appropriate trust boundary. Database
queries should distinguish code from data, authentication decisions
should be made by trusted backend logic, and sensitive network traffic
should be protected using TLS.

## Ethical Use

All vulnerability demonstrations in this project should be performed
only against the author's own application, accounts, database, and
controlled network environment.

Do not use the techniques demonstrated by this project to access,
intercept, modify, or test third-party systems without explicit
authorization.

## Academic Note

This repository supports a cybersecurity course project. Any external
sources, tools, code, or generative-AI assistance used in the submitted
assessment should be acknowledged according to the applicable course
requirements.
