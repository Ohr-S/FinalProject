# pip3 install mysql-connector-python
import contextlib
import random
import string
from typing import Optional

import bcrypt as bcrypt
from flask import Flask, request, abort, make_response
from settings import dbpwd
import mysql.connector as mysql
import json
from datetime import date, datetime
import threading

lock = threading.Lock()

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


# db = mysql.connect(
#     host="localhost",
#     user="root",
#     passwd=dbpwd,
#     database="blog")

db = mysql.connect(
    # host="ohr-databas.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
    host="localhost",
    user="root",
    passwd=dbpwd,
    database="blog")

print(db)


@contextlib.contextmanager
def get_cursor():
    with lock:
        cursor = db.cursor()
        yield cursor
        cursor.close()


# local
app = Flask(__name__)


# remote
# app = Flask(__name__, static_folder='./build', static_url_path='/')


# @app.route('/')
# def index():
#     return app.send_static_file('index.html')
# CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# CORS(app,supports_credentials=True,origins=["http://localhost:3000", "http://127.0.0.1:5000"], expose_headers='Set-Cookie')

# CORS(app,supports_credentials=True,origins=["http://localhost:3000", "http://127.0.0.1:5000"], expose_headers='Set-Cookie')
@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()


def get_all_posts():
    query = "select p.id, p.title, p.body, u.username, p.created_at from posts p join users u on p.user_id = u.id"
    with get_cursor() as cursor:
        cursor.execute(query)
        records = cursor.fetchall()
        # cursor.close()
        print(records)
        header = ['id', 'title', 'body', 'username', 'created_at']
        data = [dict(zip(header, r)) for r in records]
        for item in data:
            item["created_at"] = item["created_at"].isoformat()
        return json.dumps(data)


def get_user_id_from_session_token(cursor, session_token):
    cursor.execute('SELECT user_id FROM sessions WHERE session_id = %s', (session_token,))
    results = cursor.fetchall()
    if len(results) != 1:
        return None
    return results[0][0]


def get_post_by_id(post_id, cursor, session_token):
    user_id = get_user_id_from_session_token(cursor, session_token)
    query = "select p.id, p.title, p.body, u.username, p.created_at, u.id from posts p join users u on p.user_id = u.id where p.id=%s"
    values = (post_id,)
    cursor.execute(query, values)
    record = cursor.fetchone()
    header = ['id', 'title', 'body', 'username', 'created_at']
    item = dict(zip(header, record))
    item["created_at"] = item["created_at"].isoformat()
    item['is_author'] = record[-1] == user_id
    return json.dumps(item)


def edit_post(post_id, cursor, title, body):
    update_query = 'UPDATE posts SET title = %s, body = %s WHERE id = %s'
    cursor.execute(update_query, (title, body, post_id))
    cursor.fetchall()
    db.commit()
    return ""


def delete_post(post_id, cursor):
    delete_query = 'DELETE FROM comments WHERE post_id = %s'
    cursor.execute(delete_query, (post_id,))
    delete_query = 'DELETE FROM posts WHERE id = %s'
    cursor.execute(delete_query, (post_id,))
    cursor.fetchall()
    db.commit()
    return ""


@app.route("/posts/<post_id>", methods=['GET', 'PUT', 'DELETE'])
def manage_single_post(post_id):
    session_token = request.cookies.get('blog_session_id')

    with get_cursor() as cursor:
        if request.method == 'GET':
            return get_post_by_id(post_id, cursor, session_token)

        auth_query = 'SELECT post.id FROM sessions sess JOIN posts post ON post.user_id = sess.user_id WHERE post.id = %s AND sess.session_id = %s'
        cursor.execute(auth_query, (post_id, session_token))

        results = cursor.fetchall()
        if len(results) != 1:
            abort(401)
            return

        if request.method == 'PUT':
            data = request.get_json()
            title, body = data['title'], data['body']
            return edit_post(post_id, cursor, title, body)
        else:  # DELETE
            return delete_post(post_id, cursor)


def get_comments(post_id, cursor):
    cursor.execute('SELECT com.content, com.created_at, user.username FROM comments com '
                   'JOIN users user ON user.id = com.user_id WHERE com.post_id = %s', (post_id,))
    raw_results = cursor.fetchall()
    results = [{"content": content, "created_at": created_at.isoformat(), "author": username} for
               content, created_at, username in raw_results]
    return json.dumps(results)


def add_comment(post_id, user_id, cursor, content):
    cursor.execute('INSERT INTO comments (created_at, user_id, post_id, content) VALUES (%s, %s, %s, %s)',
                   (datetime.now().isoformat(), user_id, post_id, content))
    cursor.fetchall()
    db.commit()
    return ""


@app.route('/posts/<post_id>/comments', methods=['GET', 'POST'])
def manage_comments(post_id):
    with get_cursor() as cursor:
        if request.method == 'GET':
            return get_comments(post_id, cursor)

        session_token = request.cookies.get('blog_session_id')
        user_id = get_user_id_from_session_token(cursor, session_token)
        if user_id is None:
            abort(401)
            return

        data = request.get_json()
        return add_comment(post_id, user_id, cursor, data['content'])


def add_post():
    data = request.get_json()
    session_token = request.cookies.get('blog_session_id')
    if session_token is None:
        abort(401)

    with get_cursor() as cursor:
        user_query = "select user_id from sessions where session_id=%s"
        cursor.execute(user_query, (session_token,))
        res = cursor.fetchmany()
        user_id, = res[0]
        query = "insert into posts (title, body, user_id, created_at) values (%s,%s, %s , %s)"
        values = (data['title'], data['body'], user_id, datetime.now().isoformat())
        cursor.execute(query, values)
        db.commit()
        # new_post_id = cursor.lastrowid
        # cursor.close()
        return get_post_by_id(cursor.lastrowid, cursor, session_token)


@app.route("/sign_up", methods=['POST'])
def signup():
    data = request.get_json()
    salt = bcrypt.gensalt()
    username = data['username']
    raw_password = data['password']
    hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), salt=salt)
    check_query = 'select id from users where username = %s'
    with get_cursor() as cursor:
        cursor.execute(check_query, (username,))
        res = cursor.fetchmany()
        if res:
            abort(401)
        insert_query = 'insert into users (username, password) values (%s, %s)'
        cursor.execute(insert_query, (username, hashed_password))
        db.commit()
        cursor.fetchmany()
        # cursor.close()
        return login(username, raw_password)


@app.route("/login", methods=['POST'])
def login(username: Optional[str] = None, raw_password: Optional[str] = None):
    data = request.get_json()
    if username is None:
        username = data['username']
    get_passwd_query = 'select id, password from users where username = %s'
    with get_cursor() as cursor:
        cursor.execute(get_passwd_query, (username,))
        result = cursor.fetchmany()
        if not result:
            abort(401)
        user_id, user_hashed_password = result[0]
        user_hashed_password = bytes(user_hashed_password)[:60]
        if raw_password is None:
            raw_password = data['password']

        if not bcrypt.checkpw(raw_password.encode('utf-8'), user_hashed_password):
            abort(401)

        new_session_token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32))
        insert_session_token = 'insert into sessions (session_id, user_id) values (%s, %s)'
        cursor.execute(insert_session_token, (new_session_token, user_id))
        db.commit()
        cursor.fetchmany()
        # cursor.close()

        resp = make_response()
        resp.set_cookie("blog_session_id", new_session_token, path="/", samesite='none', secure=True)
        return resp


@app.route("/logout", methods=['POST'])
def logout():
    session_token = request.cookies.get('blog_session_id')
    print(f'session token: {session_token}')
    with get_cursor() as cursor:
        cursor.execute('delete from sessions where session_id = %s', (session_token,))
        db.commit()
        cursor.fetchmany()
        # cursor.close()
        resp = make_response()
        resp.set_cookie("blog_session_id", '', expires=0)
        return resp


if __name__ == "__main__":
    app.run(debug=True)

print("SERVER RUNNING")
