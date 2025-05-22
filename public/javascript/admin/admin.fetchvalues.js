let form = document.getElementById("valueform");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formdata = new FormData(form);
  const response = await fetch("/admin/updatevalue", {
    method: "POST",
    body: formdata,
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.message;
  alert(results);
  window.location.href = "/admin/values";
});
