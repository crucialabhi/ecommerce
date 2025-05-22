function formatTime(tweetTime) {
  let userTimeZone =
    localStorage.getItem("timezone") ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tweetDate = new Date(tweetTime);

  const now = new Date();

  const localTweetTime = new Date(
    tweetDate.toLocaleString("en-US", { timeZone: userTimeZone })
  );

  const diffInSeconds = Math.floor((now - localTweetTime) / 1000);

  let timeAgo;
  if (diffInSeconds < 60) timeAgo = `${diffInSeconds} sec ago`;
  else if (diffInSeconds < 3600)
    timeAgo = `${Math.floor(diffInSeconds / 60)} min ago`;
  else if (diffInSeconds < 86400)
    timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
  else if (diffInSeconds < 604800)
    timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
  else timeAgo = formatDateTime(localTweetTime);

  return `${timeAgo} (${formatDateTime(localTweetTime)})`;
}
function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}
async function fetchvendor() {
  document.getElementById("notify").innerHTML = "";
  const response = await fetch("/admin/fetch-vendors", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  const names = results.map((obj) => obj.email);
  let options = document.getElementById("notify");
  //   let op1 = document.getElementById("notify").innerHTML = `<option value="${names}">to all</option>`
  let op1 = (document.getElementById(
    "notify"
  ).innerHTML = `<option value="all">to all</option>`);

  names.forEach((element) => {
    let option = `<option value="${element}">${element}</option>`;
    options.innerHTML += option;
  });
}
let form = document.getElementById("notification");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formdata = new FormData(form);
  let email = document.getElementById("notify").value;
  let msg = document.getElementById("Content").value;
  const response = await fetch("/admin/sendnotification", {
    method: "POST",
    body: formdata,
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const socket = io();
  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('join', '1');
    socket.emit('notification', { id: `${email}`, str: `Admin : ${msg}` });
  });
  const json = await response.json();
  let results = json.message;
  alert(results);
  form.reset();
  fetchnotifications();
});

async function fetchnotifications() {
  document.getElementById("tbody").innerHTML = "";
  const response = await fetch("/admin/fetchnotifications", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  let tablebody = document.getElementById("tbody");
  results.forEach((result) => {
    if (result.notification_is_readed == "1") {
      const row = `<tr>
    <td>${result.notification_id}</td>
    <td>${result.notification_for}</td>
    <td>${formatTime(result.notification_created_at)}</td>
    <td>${result.notification_subject}</td> 
    <td><i class="fa-solid fa-thumbs-up"></i></td></tr>`;
      tablebody.innerHTML += row;
    } else {
      const row = `<tr>
    <td>${result.notification_id}</td>
    <td>${result.notification_for}</td>
    <td>${formatTime(result.notification_created_at)}</td>
    <td>${result.notification_subject}</td> 
    <td><i class="fa-solid fa-circle-xmark"></i></td></tr>`;
      tablebody.innerHTML += row;
    }
  });
}
{
  /*  */
}
fetchvendor();
fetchnotifications();
