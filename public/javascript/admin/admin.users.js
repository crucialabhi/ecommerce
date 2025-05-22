async function getUserByGroupByCitys() {
  let respone = await fetch("/admin/userGroupByCity");
  let result = await respone.json();


  let xUserByGroupByCitysValues = [];
  let yUserByGroupByCitysValues = [];
  let barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];

  for (let i = 0; i < result.data.length; i++) {

    xUserByGroupByCitysValues[i] = result.data[i].city;
    yUserByGroupByCitysValues[i] = result.data[i].cnt;
  }

  let chart1 = document.getElementById("myBarChart").getContext("2d");

  const myChart1 = new Chart(chart1, {
    type: "pie",
    data: {
      labels: xUserByGroupByCitysValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yUserByGroupByCitysValues,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

getUserByGroupByCitys();

async function getUserOverView() {
  let table = document.getElementById("user_table");

  let str = " ";

  let respone = await fetch("/admin/usersOverView");
  let result = await respone.json();


  str += `<tr>`;
  for (const key in result.data.results[0]) {
    str += `<td>${key}</td>`;
  }
  str += `</tr>`;

  for (let i = 0; i < result.data.results.length; i++) {
    str += `<tr>`;
    for (let [key, value] of Object.entries(result.data.results[i])) {
      str += `<td> ${value} </td>`;
    }
    str += `</tr>`;
  }

  table.innerHTML = str;
  str = " ";
}
getUserOverView()



function paginationNumber(page, lastPage) { 

  let paginationHtml = `<ul id="pagination">`
  
      if (page > 1) {
          paginationHtml += `<li><a href="/admin/usersOverView/?page=1" id="first" onclick="getData(event)"> << </a></li>`;
      }
  
      if (page > 1) {
      paginationHtml += `<li><a href="/admin/usersOverView/?page=${parseInt(page) -1}" id="second" onclick="getData(event)"> ${parseInt(page) -1} </a></li>`
      }
  
      paginationHtml +=  `<li><a href="/admin/usersOverView/?page=${page}" id="mid" onclick="getData(event)"> ${page} </a></li>`
  
      if (page < lastPage) {
          paginationHtml += `<li><a href="/admin/usersOverView/?page=${parseInt(page) +1}" id="seclast" onclick="getData(event)"> ${parseInt(page) +1} </a></li>`
      }
  
      if (page < lastPage) {
          paginationHtml += `
          <li><a href="/admin/usersOverView/?page=${lastPage}" id="last" onclick="getData(event)"> >> </a></li>`;
      }
  
  paginationHtml += `</ul>`
  
  document.getElementById('paginationNumber').innerHTML = paginationHtml
  
  }
  

let uniurlUsers =`/admin/usersOverView?page=1`


async function getTableData(url) {

  let str = " "


  let respone = await fetch(url)

    const result = await respone.json();
   

    let currPage = result.data.currentpage;
    let totalpage = result.data.totalPage
   
        str += `<tr>`
        for(let [key, value] of Object.entries(result.data.results[0])){
            str += `<td> ${key} </td>`
        }
        str += `</tr>`
        
    

    for(let i=0; i < result.data.results.length;i++){

        str += `<tr>`

        for(let [key, value] of Object.entries(result.data.results[i])){

           str += `<td> ${value} </td>`
        
        }          
    }
    str += `</tr>`

    document.getElementById('user_table').innerHTML = str
    str = " "
    
    paginationNumber(currPage, totalpage)
}

async function searchuser() {
  let str = " "
  let query = document.getElementById("query").value
  let formdata = new FormData()
  formdata.append("query",query)
  let response = await fetch("/admin/usersearch",{
    method: "POST",
    body:formdata
    });
    if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    str += `<tr>`
    for(let [key, value] of Object.entries(result.data[0])){
        str += `<td> ${key} </td>`
    }
    str += `</tr>`
    


for(let i=0; i < result.data.length;i++){

    str += `<tr>`

    for(let [key, value] of Object.entries(result.data[i])){

       str += `<td> ${value} </td>`
    
    }          
}
str += `</tr>`

document.getElementById('user_table').innerHTML = str
str = " "
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
