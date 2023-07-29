# pip3 install mysql-connector-python
import contextlib
import random
import string
import uuid
from typing import Optional

import bcrypt as bcrypt
from flask import Flask, request, abort, make_response
from hw4.client.blog.src.backend.settings import dbpwd, maintenance_email, maintenance_email_password, \
    maintenance_email_providor_server, blog_url
import mysql.connector as mysql
import json
from datetime import date, datetime, timedelta

import smtplib, ssl

port = 465
context = ssl.create_default_context()


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


pool = mysql.pooling.MySQLConnectionPool(
    host="localhost",
    user="root",
    passwd=dbpwd,
    database="blog",
    buffered=True,
    pool_size=3)


@contextlib.contextmanager
def get_cursor():
    db_connection = pool.get_connection()
    cursor = db_connection.cursor()
    try:
        yield cursor, db_connection
    finally:
        cursor.close()
        db_connection.close()


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
    with get_cursor() as (cursor, _):
        cursor.execute(query)
        records = cursor.fetchall()

    print(records)
    header = ['id', 'title', 'body', 'username', 'created_at']
    data = [dict(zip(header, r)) for r in records]
    for item in data:
        item["created_at"] = item["created_at"].isoformat()
    return json.dumps(data)


def get_user_id():
    session_token = request.cookies.get('blog_session_id')
    if session_token is None:
        return None

    with get_cursor() as (cursor, _):
        cursor.execute('SELECT user_id FROM sessions WHERE session_id = %s', (session_token,))
        results = cursor.fetchall()

    if len(results) != 1:
        return None
    return results[0][0]


def get_post_by_id(post_id):
    user_id = get_user_id()
    with get_cursor() as (cursor, _):
        query = "select p.id, p.title, p.body, u.username, p.created_at, u.id from posts p join users u on p.user_id = u.id where p.id=%s"
        values = (post_id,)
        cursor.execute(query, values)
        record = cursor.fetchone()

    header = ['id', 'title', 'body', 'username', 'created_at']
    item = dict(zip(header, record))
    item["created_at"] = item["created_at"].isoformat()
    item['is_author'] = record[-1] == user_id
    return json.dumps(item)


def edit_post(post_id, title, body):
    with get_cursor() as (cursor, db_connection):
        update_query = 'UPDATE posts SET title = %s, body = %s WHERE id = %s'
        cursor.execute(update_query, (title, body, post_id))
        db_connection.commit()
    return ""


def delete_post(post_id):
    with get_cursor() as (cursor, db_connection):
        delete_query = 'DELETE FROM comments WHERE post_id = %s'
        cursor.execute(delete_query, (post_id,))
        delete_query = 'DELETE FROM posts WHERE id = %s'
        cursor.execute(delete_query, (post_id,))
        db_connection.commit()
    return ""


def get_author_of_post(post_id):
    with get_cursor() as (cursor, _):
        cursor.execute('SELECT post.user_id FROM posts post WHERE post.id = %s', (post_id,))
        results = cursor.fetchall()

    if len(results) != 1:
        return -1

    return results[0][0]


@app.route("/posts/<post_id>", methods=['GET', 'PUT', 'DELETE'])
def manage_single_post(post_id):
    if request.method == 'GET':
        return get_post_by_id(post_id)

    user_id = get_user_id()
    post_author_user_id = get_author_of_post(post_id)
    if user_id != post_author_user_id:
        abort(401)

    if request.method == 'PUT':
        data = request.get_json()
        title, body = data['title'], data['body']
        return edit_post(post_id, title, body)
    else:  # DELETE
        return delete_post(post_id)


def get_comments(post_id):
    with get_cursor() as (cursor, _):
        cursor.execute('SELECT com.content, com.created_at, user.username FROM comments com '
                       'JOIN users user ON user.id = com.user_id WHERE com.post_id = %s', (post_id,))
        raw_results = cursor.fetchall()

    results = [{"content": content, "created_at": created_at.isoformat(), "author": username} for
               content, created_at, username in raw_results]
    return json.dumps(results)


def add_comment(post_id, user_id, content):
    with get_cursor() as (cursor, db_connection):
        cursor.execute('INSERT INTO comments (created_at, user_id, post_id, content) VALUES (%s, %s, %s, %s)',
                       (datetime.now().isoformat(), user_id, post_id, content))
        db_connection.commit()
    return ""


@app.route('/posts/<post_id>/comments', methods=['GET', 'POST'])
def manage_comments(post_id):
    if request.method == 'GET':
        return get_comments(post_id)

    user_id = get_user_id()
    if user_id is None:
        abort(401)

    data = request.get_json()
    return add_comment(post_id, user_id, data['content'])


def add_post():
    data = request.get_json()
    user_id = get_user_id()
    if user_id is None:
        abort(401)

    with get_cursor() as (cursor, db_connection):
        query = "insert into posts (title, body, user_id, created_at) values (%s,%s, %s , %s)"
        values = (data['title'], data['body'], user_id, datetime.now().isoformat())
        cursor.execute(query, values)
        db_connection.commit()

    return get_post_by_id(cursor.lastrowid)


@app.route("/sign_up", methods=['POST'])
def signup():
    data = request.get_json()
    salt = bcrypt.gensalt()
    username = data['username']
    raw_password = data['password']
    hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), salt=salt)
    check_query = 'SELECT id FROM users WHERE username = %s'
    with get_cursor() as (cursor, db_connection):
        cursor.execute(check_query, (username,))
        res = cursor.fetchmany()
        if res:
            abort(401)

        insert_query = 'INSERT INTO users (username, password) VALUES (%s, %s)'
        cursor.execute(insert_query, (username, hashed_password))

        db_connection.commit()

    return login(username, raw_password)


@app.route("/login", methods=['POST'])
def login(username: Optional[str] = None, raw_password: Optional[str] = None):
    data = request.get_json()
    if username is None:
        username = data['username']
    get_passwd_query = 'select id, password from users where username = %s'
    with get_cursor() as (cursor, db_connection):
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
        db_connection.commit()

    resp = make_response()
    resp.set_cookie("blog_session_id", new_session_token, path="/", samesite='none', secure=True)
    return resp


@app.route("/logout", methods=['POST'])
def logout():
    session_token = request.cookies.get('blog_session_id')

    with get_cursor() as (cursor, db_connection):
        cursor.execute('delete from sessions where session_id = %s', (session_token,))
        db_connection.commit()

    resp = make_response()
    resp.set_cookie("blog_session_id", '', expires=0)
    return resp


def send_mail(email, subject, message):
    with smtplib.SMTP_SSL(maintenance_email_providor_server, port, context=context) as server:
        server.login(maintenance_email, maintenance_email_password)
        server.sendmail(maintenance_email, email, f'Subject: {subject}\n\n{message}')


def add_password_reset(user_id):
    expired_date = datetime.now() + timedelta(minutes=15)

    with get_cursor() as (cursor, db_connection):
        cursor.execute('INSERT INTO password_resets (user_id, token, expire_date) VALUES (%s, UUID(), %s);', (
                           user_id,
                           expired_date,
                       ))
        cursor.execute('SELECT token from password_resets where id=(SELECT LAST_INSERT_ID());')
        records = cursor.fetchall()
        if len(records) != 1:
            db_connection.rollback()
            abort(500)

        db_connection.commit()
    return records[0][0]


@app.route('/password_resets', methods=['POST'])
def create_password_reset():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    if username is None or email is None:
        abort(400)

    with get_cursor() as (cursor, _):
        cursor.execute('SELECT user.id FROM users user WHERE user.username = %s', (username,))
        records = cursor.fetchall()

    if len(records) != 1:
        abort(404)

    user_id = records[0][0]
    token = add_password_reset(user_id)
    send_mail(email, "Ohr's blog password reset", f"""\
    To reset the password click the link {blog_url}/password_reset/{token}
    """)
    return ""


def check_if_password_reset(token):
    with get_cursor() as (cursor, db_connection):
        cursor.execute("DELETE FROM password_resets WHERE expire_date < '%s'", (datetime.now(),))
        db_connection.commit()
    with get_cursor() as (cursor, _):
        cursor.execute('SELECT user.username FROM password_resets pr JOIN users user ON user.id = pr.user_id WHERE pr.token = %s', (token,))
        records = cursor.fetchall()
    if len(records) != 1:
        abort(404)

    return {'username': records[0][0]}


def reset_password(token):
    data = request.get_json()
    raw_password = data.get('password')
    if raw_password is None:
        abort(400)

    with get_cursor() as (cursor, db_connection):
        cursor.execute("DELETE FROM password_resets WHERE expire_date < %s", (datetime.now(),))
        db_connection.commit()

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), salt=salt)

    with get_cursor() as (curser, db_connection):
        curser.execute('SELECT user_id FROM password_resets WHERE token = %s', (token,))
        records = curser.fetchall()
        if len(records) != 1:
            abort(404)
        user_id = records[0][0]
        curser.execute('DELETE FROM password_resets WHERE user_id = %s', (user_id,))
        curser.execute('UPDATE users SET password = %s WHERE id = %s', (hashed_password, user_id))
        db_connection.commit()
    return ""


@app.route('/password_resets/<token>', methods=['GET', 'PUT'])
def handle_password_reset(token):
    if request.method == 'GET':
        return check_if_password_reset(token)
    else:
        return reset_password(token)


if __name__ == "__main__":
    app.run(debug=True)

# if __name__ == '__main__':
#     send_mail('ohrsh59@gmail.com', 'fullstack tests', 'Hi!\nThis is sent using python\n\n')
print("SERVER RUNNING")
