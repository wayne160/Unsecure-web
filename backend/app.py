from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import secrets
import jwt

app = Flask(__name__)
CORS(app)
SECRET = 'Waycole1314'

@app.post("/login")
def login():
    data = request.get_json()
    sql = f'SELECT id, username FROM users WHERE username = \'{data['username']}\' AND password = \'{data['password']}\''
    # values = (data['username'], data['password'])
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    cursor = conn.cursor()
    cursor.execute(sql)
    user = cursor.fetchone()
    if user == None:
        return jsonify('invalid user')
    return jsonify("loggedin")

@app.post("/register")
def register():
    data = request.get_json()
    sql = f'INSERT INTO users (username, password) VALUES (%s, %s)'
    values = (data['username'], data['password'])
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    cursor = conn.cursor()
    cursor.execute(sql, values)
    user_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    session_id = secrets.token_urlsafe(32)
    return jwt.encode({'user_id': user_id, 'session_id': session_id}, SECRET, algorithm='HS256')

# users = [{
#     'username': 'wayne'
# },
# {
#     'username': 'nicole'
# },
# {
#     'username': 'nicole'
# },
# {
#     'username': 'nicole'
# },
# {
#     'username': 'nicole'
# }]
@app.get("/users")
def getUsers():
    query = request.args.get('query')
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    sql = f'SELECT username FROM users WHERE username LIKE \'%{query}%\''
    print(sql)
    cursor = conn.cursor()
    cursor.execute(sql)
    users = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()
    print(users)
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True, port=8000)