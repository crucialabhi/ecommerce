

async function verify(id) {
  let text = "do you want to authorize vendor!";
  if (confirm(text) == true) {
    const response = await fetch("/admin/authorize-vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    alert(json.message);
    window.location.href = "/admin/pending-verification"
  } else {
    alert("you cancled authorization");
  }
}
document
  .getElementById("rejectionform")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    var id = document.getElementById("btn").value
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    let reason = document.getElementById("value").value;
    const response = await fetch("/admin/rejectvarification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: reason ,id:id}),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    alert(json.message);
    window.location.href = "/admin/pending-verification"
  });
async function reject() {}
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};