document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#send').disabled = true;
    
    document.querySelector('#input').onkeyup = () => {
        if (document.querySelector('#input').value.length > 0)
        document.querySelector('#send').disabled = false;
        else
        document.querySelector('#send').disabled = true;
    }

    
    // Enable button only if there is text in the input field

     /*
    document.querySelector('#input').onkeyup = () => {
    if (document.querySelector('#input').value.length > 0)
        document.querySelector('#send').disabled = false;
    else
        document.querySelector('#send').disabled = true;
     }
     */


    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // When SEND button is pressed
    socket.on('connect', () => {
        document.querySelector("#input").addEventListener("keyup", () => {
            if (event.keyCode === 13) {
            message = document.querySelector("#input").value            
            console.log("Clicked")
            document.querySelector("#input").value = ""
            socket.emit('message sent', {'message': message})
            }
        })
        document.querySelector("#send").onclick = () => {
            message = document.querySelector("#input").value            
            console.log("Clicked")
            document.querySelector("#input").value = ""
            socket.emit('message sent', {'message': message})
        };
    });


    //Create a new message
    socket.on('message sent', data => {
        console.log(data)
        const messagetag = document.createElement('div');
        messagetag.setAttribute("class", "message");
        const toastheader = document.createElement('div');
        toastheader.setAttribute("class", "toast-header");
        const username = document.createElement("strong");
        username.setAttribute("class", "mr-auto username");
        username.innerHTML = "Bootstrap"
        const toastbody = document.createElement("div");
        toastbody.setAttribute("class", "toast-body")
        toastbody.innerHTML = `${data.message}`
        console.log("all added")
        //structure
        messagetag.appendChild(toastheader)
        toastheader.appendChild(username)
        messagetag.appendChild(toastbody)
        document.querySelector(".chat").append(messagetag)
    });


    //Addition of the new thread to the list threads
    socket.on('thread created', data => {
        console.log(data)
        const li = document.createElement('li');
        const a = document.createElement('a')
        li.innerHTML = `${data.thread_name}`;
        a.appendChild(li);
        var url = "chat"
        var param = `${data.thread_name}`
        a.href = url + "/" + param;
        document.querySelector('#threads').append(a);
    });
});