document.getElementById("updatetaxform").addEventListener('submit',async (e)=>{
    let form = document.getElementById("updatetaxform")
    e.preventDefault()
    let formdata= new FormData(form)
    let response = await fetch("/admin/updatetax",{
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
})
async function calculatetotaltax() {
    let sgst = document.getElementById("sgst").value;
    let cgst = document.getElementById("cgst").value;
    if(cgst ==  "" && sgst ==  ""){
        document.getElementById("total").value = "enter text value"
    }

    else{
        total = Number(cgst) + Number(sgst)
        document.getElementById("total").value = total
    }
}