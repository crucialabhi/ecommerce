let form = document.getElementById("notification")
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formdata = new FormData(form);
    const response = await fetch("/vendor/contacttoadmin", {
      method: "POST",
     
      body: formdata,
    });
    
    if (!response.ok) {
      window.location.href = '/auth/vendor-login'
      throw new Error(`Response status: ${response.status}`);
    }
    let msg = document.getElementById("Content").value;
    let username = document.getElementById("username").innerHTML;
    const json = await response.json();
    const socket = io();
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('join', '1');
      socket.emit('notification', { id: 1, str: `${username} : ${msg}` });
      console.log("hey");
    });
    let results = json.message;
    alert(results);
    form.reset()
  });