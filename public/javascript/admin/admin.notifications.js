function formatTime(tweetTime) {
  if (tweetTime == "null") {
    return "not updated";
  } else {
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
async function markallasread() {
  const response = await fetch("/admin/markallasread", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.message;
  alert(results);
  fetchreadnotifications();
  fetchunreadnotifications();
}
async function fetchunreadnotifications() {
  document.getElementById("notifications").innerHTML = "";
  const response = await fetch("/admin/notificationsunreaded", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  let container = document.getElementById("notifications");
  document.getElementById("unreadno").innerText = results.length;
  results.forEach((result) => {
    div = `<div class="notification unreaded" id="unread"><div class="avatar"><img src="/images/notification.png"></div>
          <div class="text">
            <div class="text-top">
              <p><span class="profil-name"> ${
                result.notification_created_by
              } </span> ${result.notification_subject} <b> ${
      result.notification_content
    } </b><span class="unread-dot" onclick="markasreaded(${
      result.notification_id
    })" id="${result.notification_id})"></span></p>
            </div>
            <div class="text-bottom">${formatTime(
              result.notification_created_at
            )}</div>
          </div></div>`;
    container.innerHTML += div;
  });
}
async function fetchreadnotifications() {
  document.getElementById("readednotification").innerHTML = "";
  const response = await fetch("/admin/notificationsreaded", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  let notification = document.getElementById("readednotification");
  results.forEach((result) => {
    div = ` <div class="notification readed private-message">
  <div class="avatar"><img src="/images/notification.png"></div>
  <div class="text">
    <div class="text-top">
      <p><span class="profil-name"> ${result.notification_created_by} </span> ${
      result.notification_subject
    } <b> ${result.notification_content} </b><span></span></p>
    </div>
    <div class="text-bottom">${formatTime(result.notification_created_at)}</div>
  </div></div>`;
    notification.innerHTML += div;
  });
}
fetchunreadnotifications();
fetchreadnotifications();
async function markasreaded(id) {
  let formdata = new FormData();
  formdata.append("id", id);
  const response = await fetch("/admin/markasread", {
    method: "POST",
    body: formdata,
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.message;
  fetchunreadnotifications();
  fetchreadnotifications();
}

