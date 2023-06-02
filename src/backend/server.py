# pip3 install mysql-connector-python
import random

from flask import Flask, request
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
CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/posts', methods=['GET', 'POST'])
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
    # [(1, 'Herzliya', 95142), (2, 'Tel Aviv', 435855), (3, 'Jerusalem', 874186), (4, 'Bat Yam', 128898), (5, 'Ramat Gan', 153135), (6, 'Eilat', 47800), (7, 'Petah Tikva', 233577), (8, 'Tveriya', 41300)]
    header = ['id', 'title', 'body', 'username', 'created_at']
    data = [dict(zip(header, r)) for r in records]
    for item in data:
        item["created_at"] = item["created_at"].isoformat()
    return json.dumps(data)


@app.route("/post/<id>")
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
    print(data)
    cursor = db.cursor()
    username = data['username']
    username_query = "select id from users where username=%s"
    cursor.execute(username_query, (username,))
    user_id, = cursor.fetchmany()[0]
    query = "insert into posts (id,title, body, user_id, created_at) values (%s, %s,%s, %s , %s)"
    postid = random.randint(10,9999)
    values = (postid, data['title'], data['body'], user_id, datetime.now().isoformat())
    cursor.execute(query, values)
    db.commit()
    # new_post_id = cursor.lastrowid
    cursor.close()
    return get_post_by_id(postid)


if __name__ == "__main__":
    app.run(debug=True)

print("SERVER RUNNING")