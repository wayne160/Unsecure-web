from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
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
    return jwt.encode({'user_id': user[0]}, SECRET, algorithm='HS256')

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
    return jwt.encode({'user_id': user_id}, SECRET, algorithm='HS256')

@app.get("/users")
def getUsers():
    query = request.args.get('query')
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    sql = f'SELECT id, username FROM users WHERE username LIKE \'%{query}%\''
    print(sql)
    cursor = conn.cursor()
    cursor.execute(sql)
    users = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()
    print(users)
    return jsonify(users)

@app.get("/user")
def getUser():
    token = request.args.get('token')
    userId = jwt.decode(token, SECRET, algorithms=['HS256'])['user_id']
    return jsonify(userId)

@app.post("/send")
def send():
    data = request.get_json()
    content = data['content']
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    sql = f'INSERT INTO messages (content, sender_id, receiver_id) VALUES (\'{content}\', {sender_id}, {receiver_id})'
    cursor = conn.cursor()
    cursor.execute(sql)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify('success')

@app.get("/messages")
def messages():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="22573316199zZ@",
        database="schema1"
    )
    sql = f'SELECT content, timestamp, sender_id, receiver_id FROM messages WHERE (sender_id = {sender_id} and receiver_id = {receiver_id}) or (sender_id = {receiver_id} or receiver_id = {sender_id})'
    cursor = conn.cursor()
    cursor.execute(sql)
    messages = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()
    return messages
if __name__ == "__main__":
    app.run(debug=True, port=8000)