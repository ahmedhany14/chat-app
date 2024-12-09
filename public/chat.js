const socket = io()
// this is for increment button in index.html, which used to increment the count with 1 by socket.io
/*
socket.on('ahmed', (message) => {
    console.log(message)
});
document.querySelector('#increment').addEventListener('click', () => {
    console.log('increment button clicked');
    socket.emit('increment');
});*/

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message);
});


socket.on('message', (message) => {
    console.log(message)
});