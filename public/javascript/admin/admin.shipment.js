async function searchorder() {
  let query = document.getElementById("searching").value;
  if(query == ""){
    window.location.href = `/admin/shipment`
  }
  let formdata = new FormData()
  formdata.append("query",query)
  let response = await fetch("/admin/searchorders",{
  method: "POST",
  body:formdata
});
if (!response.ok) {
  throw new Error(`Response status: ${response.status}`);
}


let results = await response.json();
let result = results.data;
if(result.length == 0){
let str = "no data found with this order id"
document.getElementById('customers').innerHTML = str
}
else{


let str = " "

document.getElementById("customers").innerHTML = "";
let tablebody = document.getElementById("customers");

str += `<tr>`
for(let [key, value] of Object.entries(results.data[0])){
    str += `<td> ${key} </td>`
}
str += `
<td> update status </td>
</tr>`



for(let i=0; i < results.data.length;i++){

str += `<tr>`

for(let [key, value] of Object.entries(results.data[i])){

   str += `<td> ${value} </td>
   `
}   
str += `<td> <a href="/admin/updateorder/${result[i].order_id}"><button>Edit</button></a> </td>`       
}
str += `</tr>`

document.getElementById('customers').innerHTML = str
str = " "
}
}

function paginationNumber(page, lastPage) { 

  let paginationHtml = `<ul id="pagination">`
  
      if (page > 1) {
          paginationHtml += `<li><a href="/admin/fetchorders/?page=1" id="first" onclick="getData(event)"> << </a></li>`;
      }
  
      if (page > 1) {
      paginationHtml += `<li><a href="/admin/fetchorders/?page=${parseInt(page) -1}" id="second" onclick="getData(event)"> ${parseInt(page) -1} </a></li>`
      }
  
      paginationHtml +=  `<li><a href="/admin/fetchorders/?page=${page}" id="mid" onclick="getData(event)"> ${page} </a></li>`
  
      if (page < lastPage) {
          paginationHtml += `<li><a href="/admin/fetchorders/?page=${parseInt(page) +1}" id="seclast" onclick="getData(event)"> ${parseInt(page) +1} </a></li>`
      }
  
      if (page < lastPage) {
          paginationHtml += `
          <li><a href="/admin/fetchorders/?page=${lastPage}" id="last" onclick="getData(event)"> >> </a></li>`;
      }
  
  paginationHtml += `</ul>`
  
  document.getElementById('paginationNumber').innerHTML = paginationHtml
  
  }
  

let uniurlUsers =`/admin/fetchorders/?page=1`


async function getTableData(url) {

  let str = " "


  // let respone = await fetch(url)

  let response = await fetch(url,{
      method: "POST"
    });

    const result = await response.json();

    let currPage = result.data.currentpage;
    let totalpage = result.data.totalPage;
   
        str += `<tr>`
        for(let [key, value] of Object.entries(result.data.results[0])){
            str += `<td> ${key} </td>`
        }
        str += `
        <td> update status </td>
        </tr>`
        
    

    for(let i=0; i < result.data.results.length;i++){

        str += `<tr>`

        for(let [key, value] of Object.entries(result.data.results[i])){

           str += `<td> ${value} </td>
           `
        }   
        str += `<td> <a href="/admin/updateorder/${result.data.results[i].order_id}"><span><i class="fas fa-edit"></i></span></a> </td>`       
    }
    str += `</tr>`

    document.getElementById('customers').innerHTML = str
    str = " "
    
    paginationNumber(currPage, totalpage)
}

//// for userPagination////
getTableData(uniurlUsers)

async function getData(e) {
  e.preventDefault();
  
  let id = e.target.id
  
  if(id == 'first'){
      getTableData(e.target.href)
  }else if(id == 'second'){
      getTableData(e.target.href)
  }else if(id == 'mid'){    
      getTableData(e.target.href)
  }else if(id == 'seclast'){
      getTableData(e.target.href)
  }else if(id == 'last'){
      getTableData(e.target.href)
  }
}