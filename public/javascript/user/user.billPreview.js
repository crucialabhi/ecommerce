async function getBillData() {

  let params = new URLSearchParams(document.location.search);
  let order_id = params.get("id");

  let responce = await fetch('/billMakerforUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: order_id
    })
  })
  console.log(responce, 'responce');
  if (responce.status != 200) {
    let result = await responce.json();

    if (result.message == false) {
      document.getElementById("main_div").innerHTML = `<div class='noitems'><h1>No bills available</h1></div>`;
      setTimeout(() => {
        // window.location.href = '/';
      }, 2000);
    }
  }
  else {
    const blob = await responce.blob();

    const url = window.URL.createObjectURL(blob);

    document.getElementById('bill_iframe').src = url;
  }
}
getBillData();