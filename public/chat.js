const socket = io()

console.log(`i don't know hot it works`)

socket.on('ahmed', (message) => {
    console.log(message)
});

document.querySelector('#increment').addEventListener('click', () => {
    console.log('increment button clicked');
    socket.emit('increment');
});