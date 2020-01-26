import os

from flask import Flask, redirect, render_template, request, session
from flask_socketio import SocketIO, emit
from flask_session import Session
from datetime import datetime


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
#setup websocket
socketio = SocketIO(app)

datetime = datetime.now()
active_threads = ["general"]
users_online = []


messages = {
    "from": []
    "message"[]
}


@app.route("/", methods=["GET", "POST"])
def index():
    session.clear()
    username = request.form.get("username")
    if request.method == 'POST':
        username = request.form.get("username")
        session["username"] = username
        session["logged_in"] = True
        name = session["username"]
        users_online.append(name)
        print(f"Users online {users_online}")
        print(f'user in session {session["username"]}')
        return redirect("/mainapp")
    return render_template("index.html")

@app.route("/mainapp", methods=["GET", "POST"])
def mainapp():
    #print(f"Accessed main users logged in: {users_loggedin}")
    if request.method =='GET':
        if session.get('username')  == None:
            return redirect("/")   
    name = session["username"]
    print(active_threads)
    return render_template("mainapp.html", name=name, active_threads=active_threads)


@socketio.on("thread request")
def new_thread(data):
    thread_name = data["thread_name"]
    if thread_name in active_threads:
        emit("thread exists", {"thread_name": thread_name}, broacast=True)
    else:
        active_threads.append(thread_name)
        print(thread_name)
        emit("thread created", {"thread_name": thread_name}, broadcast=True)


@app.route("/chat")
def chat():
    ''' Check if user is logged in
    if request.method =='GET':
        print("GET")
        if session.get('username')  == None:
            return redirect("/")'''
    #name = session["username"]
    thread_name = "General Chat"
    #emulating user
    name = "Name of user"
    return render_template("chat.html", thread_name=thread_name, name=name)

@app.route("/chat/<thread_name>")
def thread_name(thread_name):
    return render_template("chat.html", thread_name=thread_name)

@socketio.on("message sent")
def message_sent(data):
    message = data["message"]
    #name = session["username"]
    name = "Name of user"
    date = str(datetime.date())
    time = str(datetime.strftime("%H:%M"))
    print(date)
    print(time)
    emit("message sent", {"message": message, "name": name, "date": date, "time": time}, broadcast=True)

@app.route("/logout")
def logout():
    name = session["username"]
    print(f'user in session {name}')
    session.clear()
    return redirect("/")