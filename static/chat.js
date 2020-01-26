document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#send').disabled = true;
    input.focus();
    input.select();
    
    document.querySelector('#input').onkeyup = () => {
        if (document.querySelector('#input').value.length > 0)
        document.querySelector('#send').disabled = false;
        else
        document.querySelector('#send').disabled = true;
    }

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
        username.innerHTML = `From: ${data.name} -- Date: ${data.date} - Time: ${data.time}`
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


    var messageBody = document.querySelector('.chat');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

});