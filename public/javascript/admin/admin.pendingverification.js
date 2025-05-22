async function fetchverifications() {
  document.getElementById("cardcontainer").innerHTML = "";
  const response = await fetch("/admin/get-pending-verifications", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  let container = document.getElementById("cardcontainer");
  results.forEach((result) => {
    let card = document.createElement('div')
    card.classList.add('verificationcard')
    card.innerHTML = `<img src="/images/vendor.png" alt="Avatar" /><h4><b>${result.company_name}</b></h4><a href="/admin/company-details/${result.vendor_id}" rel="noopener noreferrer"><button>
  <span class="text">see Details</span>
</button></a>`
    container.appendChild(card) ;
  });
}
async function searchpv() {
 let query = document.getElementById("pvinput").value;
 document.getElementById("cardcontainer").innerHTML = "";
 let formdata = new FormData()
 formdata.append("query",query)

 const response = await fetch("/admin/seachcompany", {
  method: "POST",
  body:formdata,
});
if (!response.ok) {
  throw new Error(`Response status: ${response.status}`);
}

const json = await response.json();
let results = json.data;
let container = document.getElementById("cardcontainer");
results.forEach((result) => {
  let card = document.createElement('div')
  card.classList.add('verificationcard')
  card.innerHTML = `<img src="/images/vendor.png" alt="Avatar" /><h4><b>${result.company_name}</b></h4><a href="/admin/company-details/${result.vendor_id}" rel="noopener noreferrer"><button>
<span class="text">see Details</span>
</button></a>`
  container.appendChild(card) ;
});
}
fetchverifications();
