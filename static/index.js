document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // When connected, configure buttons
    socket.on('connect', () => {
        //Creation of threads
        document.querySelector("#new_thread").onclick = () => {
            var thread_name = prompt("Please select the name of the thread: ");
            console.log(thread_name)
            socket.emit('thread request', { 'thread_name': thread_name });
        };
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

socket.on('thread exists', data => {
    console.log(data)
    alert(`The thread with name ${data.thread_name} exists. Please create with another name`)
});

});