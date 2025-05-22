async function markallasread() {
    const response = await fetch("/vendor/markallasread", {
      method: "POST",
    });
    if (!response.ok) {
      window.location.href = "/auth/vendor-login";
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
    const response = await fetch("/vendor/fetchunreadnotification", {
      method: "POST",
      
    });
    if (!response.ok) {
      window.location.href = "/auth/vendor-login";
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
          <p><span class="profil-name"> ${result.notification_created_by} </span> ${result.notification_subject} <b> ${result.notification_content} </b><span class="unread-dot" onclick="markasreaded(${result.notification_id})" id="${result.notification_id})"></span></p>
        </div>
        <div class="text-bottom">${result.notification_created_at}</div>
      </div></div>`;
      container.innerHTML += div;
    });
  }
  async function fetchreadnotifications() {
    document.getElementById("readednotification").innerHTML = "";
    const response = await fetch("/vendor/fetchreadednotification", {
      method: "POST",
     
    });
    if (!response.ok) {
      window.location.href = "/auth/vendor-login";
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
  <p><span class="profil-name"> ${result.notification_created_by} </span> ${result.notification_subject} <b> ${result.notification_content} </b><span></span></p>
</div>
<div class="text-bottom">${result.notification_created_at}</div>
</div></div>`;
      notification.innerHTML += div;
    });
  }

  async function markasreaded(id) {
    let formdata = new FormData();
    formdata.append("id",id)
    const response = await fetch("/vendor/markasread", {
      method: "POST",
     
      body: formdata,
    });
    if (!response.ok) {
      window.location.href = "/auth/vendor-login";
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    let results = json.message;
    fetchunreadnotifications();
    fetchreadnotifications();
  }
  fetchunreadnotifications();
  fetchreadnotifications();
