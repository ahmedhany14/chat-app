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

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (err) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (err) return alert(err);
        console.log('Message delivered');
    });
});

document.querySelector('#send-location').addEventListener('click', async () => {

    const location = navigator.geolocation;

    await location.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', { latitude, longitude }, (err) => {
            if (err) return alert(err);
            //console.log('Location shared');
        });
    });


});

socket.on('message', (message, err) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)

});

socket.on('location', (url, err) => {
    if (err) return alert(err);
    console.log('location', url)

    const html = Mustache.render(locationTemplate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html)
});
