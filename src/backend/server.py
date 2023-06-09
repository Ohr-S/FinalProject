# pip3 install mysql-connector-python
import random
import string
from typing import Optional

import bcrypt as bcrypt
from flask import Flask, request, abort, make_response
from settings import dbpwd
import mysql.connector as mysql
import json
from flask_cors import CORS, cross_origin
from datetime import date, datetime


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


db = mysql.connect(
    host="localhost",
    user="root",
    passwd=dbpwd,
    database="blog")

print(db)

app = Flask(__name__)
# CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app,supports_credentials=True,origins=["http://localhost:3000", "http://127.0.0.1:5000"], expose_headers='Set-Cookie')
# CORS(app,supports_credentials=True,origins=["http://localhost:3000", "http://127.0.0.1:5000"], expose_headers='Set-Cookie')
# @app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()



def get_all_posts():
    query = "select p.id, p.title, p.body, u.username, p.created_at from posts p join users u on p.user_id = u.id"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    print(records)
    header = ['id', 'title', 'body', 'username', 'created_at']
    data = [dict(zip(header, r)) for r in records]
    for item in data:
        item["created_at"] = item["created_at"].isoformat()
    return json.dumps(data)


@app.route("/posts/<id>")
def get_post_by_id(id):
    query = "select p.id, p.title, p.body, u.username, p.created_at from posts p join users u on p.user_id = u.id where p.id=%s"
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    header = ['id', 'title', 'body', 'username', 'created_at']
    item = dict(zip(header, record))
    item["created_at"] = item["created_at"].isoformat()
    return json.dumps(item)


def add_post():
    data = request.get_json()
    session_token = request.cookies.get('blog_session_id')
    if session_token is None:
        abort(401)

    cursor = db.cursor()
    user_query = "select user_id from sessions where session_id=%s"
    cursor.execute(user_query, (session_token,))
    res = cursor.fetchmany()
    user_id, = res[0]
    query = "insert into posts (title, body, user_id, created_at) values (%s,%s, %s , %s)"
    values = (data['title'], data['body'], user_id, datetime.now().isoformat())
    cursor.execute(query, values)
    db.commit()
    # new_post_id = cursor.lastrowid
    cursor.close()
    return get_post_by_id(cursor.lastrowid)


@app.route("/sign_up", methods=['POST'])
def signup():
    data = request.get_json()
    salt = bcrypt.gensalt()
    username = data['username']
    raw_password = data['password']
    hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), salt=salt)
    check_query = 'select id from users where username = %s'
    cursor = db.cursor()
    cursor.execute(check_query, (username,))
    res = cursor.fetchmany()
    if res:
        abort(401)
    insert_query = 'insert into users (username, password, salt) values (%s, %s, %s)'
    cursor.execute(insert_query, (username, hashed_password, salt))
    db.commit()
    cursor.fetchmany()
    cursor.close()
    return login(username, hashed_password)


@app.route("/login", methods=['POST'])
def login(username: Optional[str] = None, hashed_password: Optional[bytes] = None):
    data = request.get_json()
    if username is None:
        username = data['username']
    get_salt_query = 'select id, password, salt from users where username = %s'
    cursor = db.cursor()
    cursor.execute(get_salt_query, (username,))
    result = cursor.fetchmany()
    if not result:
        abort(401)
    user_id, user_hashed_password, salt = result[0]
    user_hashed_password = bytes(user_hashed_password)[:60]
    salt = bytes(salt)
    if hashed_password is None:
        raw_password = data['password']
        hashed_password = bcrypt.hashpw(raw_password.encode("utf-8"), salt=salt)

    if user_hashed_password != hashed_password:
        abort(401)

    new_session_token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32))
    insert_session_token = 'insert into sessions (session_id, user_id) values (%s, %s)'
    cursor.execute(insert_session_token, (new_session_token, user_id))
    db.commit()
    cursor.fetchmany()
    cursor.close()

    resp = make_response()
    resp.set_cookie("blog_session_id", new_session_token, path="/", samesite='none', secure=True)
    return resp


@app.route("/logout", methods=['POST'])
def logout():
    session_token = request.cookies.get('blog_session_id')
    print(f'session token: {session_token}')
    cursor = db.cursor()
    cursor.execute('delete from sessions where session_id = %s', (session_token,))
    db.commit()
    cursor.fetchmany()
    cursor.close()
    resp = make_response()
    resp.set_cookie("blog_session_id", '', expires=0)
    return resp


if __name__ == "__main__":
    app.run(debug=True)

print("SERVER RUNNING")