import os

from flask import Flask, redirect, render_template, request, session
from flask_socketio import SocketIO, emit
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
#setup websocket
socketio = SocketIO(app)

active_threads = ["general"]


@app.route("/", methods=["GET", "POST"])
def index():
    session.clear()
    username = request.form.get("username")
    if request.method == 'POST':
        username = request.form.get("username")
        session["username"] = username
        session["logged_in"] = True
        print(f'user in session {session["username"]}')
        return redirect("/mainapp")
    return render_template("index.html")

@app.route("/mainapp", methods=["GET", "POST"])
def mainapp():
    #print(f"Accessed main users logged in: {users_loggedin}")
    if request.method =='GET':
        print("GET")
        if session.get('username')  == None:
            return redirect("/")
    name = session["username"]
    print(active_threads)
    return render_template("mainapp.html", name=name, active_threads=active_threads)


@socketio.on("thread request")
def new_thread(data):
    thread_name = data["thread_name"]
    active_threads.append(thread_name)
    print(thread_name)
    emit("thread created", {"thread_name": thread_name}, broadcast=True)


@app.route("/chat")
def chat():
    thread_name = "General Chat"
    return render_template("chat.html", thread_name=thread_name)

@app.route("/chat/<thread_name>")
def thread_name(thread_name):
    return render_template("chat.html", thread_name=thread_name)

@socketio.on("message sent")
def message_sent(data):
    message = data["message"]
    print(message)
    emit("message sent", {"message": message}, broadcast=True)