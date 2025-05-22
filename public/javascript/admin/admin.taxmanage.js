async function deletetax(id) {
    let text = "Do you want to delete tax";
    if (confirm(text) == true) {
    let formdata= new FormData()
    formdata.append("id",id)
    let response = await fetch("/admin/deletetax",{
        method:"post",
        body:formdata
    })
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      let results = json.message;
      alert(results)
      window.location.href = "/admin/taxmanage"
      fetchtaxes()
    } else {
        alert("you prevented the delete tax!");
      }
}
async function fetchcats() {
    document.getElementById("catid").innerHTML = ""
    const response = await fetch("/admin/fetchcatids", {
  method: "POST",
});
if (!response.ok) {
  throw new Error(`Response status: ${response.status}`);
}
const json = await response.json();
let results = json.data;
let tablebody = document.getElementById("arrivingdata");
if (results.length == 0) {
  tablebody.innerText = "no faq available";
}
let select = document.getElementById("catid")
results.forEach((result) => {
  const row = `<option value="${result.cat_id}">${result.cat_name}</option>`;
  select.innerHTML += row;
});
}
fetchcats()
async function calculatetotaltax() {
    let sgst = document.getElementById("sgst").value;
    let cgst = document.getElementById("cgst").value;
    if(cgst ==  "" && sgst ==  ""){
        document.getElementById("total").value = "0"
    }

    else{
        total = Number(cgst) + Number(sgst)
        document.getElementById("total").value = total
    }
}
document.getElementById("taxform").addEventListener("submit",async (e)=>{
    e.preventDefault()
    let form = document.getElementById("taxform")
    let formdata = new FormData(form)
    const response = await fetch("/admin/createtax", {
method: "POST",
body: formdata,
});
if (!response.ok) {
throw new Error(`Response status: ${response.status}`);
}

const json = await response.json();
let results = json.message;
alert(results)
form.reset()
fetchtaxes()
})
async function fetchtaxes() {
  document.getElementById("tbody").innerHTML = "";
const response = await fetch("/admin/fetchtaxes", {
method: "POST",
});
if (!response.ok) {
throw new Error(`Response status: ${response.status}`);
}

const json = await response.json();
let results = json.data;
let tablebody = document.getElementById("tbody");
results.forEach((result) => {
let sgst = `${result.s_gst}`
let cgst = `${result.c_gst}`
        total = Number(cgst) + Number(sgst)
  const row = `<tr>
                 <td>${result.tax_id}</td>
  <td>${result.parent_category_id}</td>
  <td>${result.s_gst}</td>
  <td>${result.c_gst}</td>
  <td>${total}</td>
  <td>${result.updated_at}</td>
  <td>${result.created_at}</td>
<td><a href="/admin/updatetax/${result.tax_id}"><span><i class="fas fa-edit"></i></span></a></td>
<td><i class="fas fa-trash" aria-hidden="true" onclick="deletetax(${result.tax_id})" id="myBtn"></i></td></tr>`;
tablebody.innerHTML += row;
});
}
fetchtaxes()
