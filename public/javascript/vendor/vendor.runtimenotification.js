// pop up
function GenericPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerText = message;

document.body.appendChild(popup);

setTimeout(() => {
  popup.classList.add('fade-out');
  popup.addEventListener('transitionend', () => {
      document.body.removeChild(popup);
  });
}, 5000);
}

let user  = document.getElementById("username").innerHTML.trim()
  const socket = io();
  socket.on('connect', () => {
    socket.emit('join', `${user}`);
  });
  socket.on('notification', (data) => {
    GenericPopup(data.str)
  });