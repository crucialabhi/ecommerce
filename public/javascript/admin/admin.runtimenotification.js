// pop up
function GenericPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("fade-out");
    popup.addEventListener("transitionend", () => {
      document.body.removeChild(popup);
    });
  }, 5000);
}
// async function socket() {
//   const response = await fetch("/admin/fetch-vendors", {
//     method: "POST",
//   });
//   if (!response.ok) {
//     throw new Error(`Response status: ${response.status}`);
//   }

//   const json = await response.json();
//   let results = json.data;
//   const names = results.map((obj) => obj.email);
//   names.forEach((element) => {
//     const socket = io();
//     socket.on("connect", () => {
//     //   socket.emit("join", `${element}`);
//     socket.emit('join', '1');
//     });
//     socket.on("notification", (data) => {
//         alert(data.str)
//       GenericPopup(data.str);
//     });
//   });
// }
// socket();
const socket = io();
socket.on('connect', () => {
  socket.emit('join', 1);
});
socket.on('notification', (data) => {
  GenericPopup(data.str)
});
