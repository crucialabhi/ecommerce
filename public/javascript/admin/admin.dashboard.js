let chart1 = document.getElementById("myLineChart").getContext("2d");

let xValues = ["Apr 5", "Apr 10", "Apr 15", "Apr 20", "Apr 25", "Apr 30"]; // this value is comes from db
let yValues = [2,5,7,3,9,5]; // this value is comes from db
let barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];



async function getMonthrevenew() {

    let respone = await fetch('/admin/getMonthrevenew');
    let result = await respone.json();
    

    let MonthChart = result.data;
        let keys = [];
        let values = [];
        MonthChart.forEach((element) => {
          keys.push(element.month_name);
          values.push(element.TotalSales);
        });

        document.getElementById('months').value = keys[keys.length-1];

    const myChart1 = new Chart(chart1, {
      type: "line",
      data: {
        labels: keys,
        datasets: [
          {
            fill: false,
            lineTension: 0.2,
            // backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: 'rgb(75, 192, 192)',
            data: values,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        }
      },
    });
}
getMonthrevenew()

async function getOrderOverView() {
  let respone = await fetch("/admin/orderOverView");
  let result = await respone.json();

  let xOrderOverVewValues = [];
  let yOrderOverVewValues = [];

  for (let i = 0; i < result.data.length; i++) {

    xOrderOverVewValues[i] = result.data[i].order_status;
    yOrderOverVewValues[i] = result.data[i].cnt;
  }

  let chart2 = document.getElementById("myPieChart").getContext("2d");

  const myChart2 = new Chart(chart2, {
    type: "pie",
    data: {
      labels: xOrderOverVewValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yOrderOverVewValues,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

getOrderOverView();

async function getSalesOverView() {
  let respone = await fetch("/admin/salesOverView");
  let result = await respone.json();
  let xSalesOverVewValues = [];
  let ySalesOverVewValues = [];

  for (let i = 0; i < result.data.length; i++) {
    xSalesOverVewValues[i] = result.data[i].product_cat_name;
    ySalesOverVewValues[i] = result.data[i].cnt;
  }
  let chart3 = document.getElementById("myBarChart").getContext("2d");

  const myChart3 = new Chart(chart3, {
    type: "bar",
    data: {
      labels: xSalesOverVewValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: ySalesOverVewValues,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

getSalesOverView();

async function getExpenseAndProfiteOverView() {
  let respone = await fetch("/admin/expenseAndProfiteOverView");
  let result = await respone.json();
  let total = result.data[0].total;

  let expense = (total * 15) / 100;
  let finalExpense = expense.toFixed(2);
  let profit = total - expense;
  let finalProfit = profit.toFixed(2);
  document.getElementById("profit").innerHTML =
    '<i class="ri-money-rupee-circle-line"></i> ' + finalProfit;
  document.getElementById("expense").innerHTML =
    '<i class="ri-money-rupee-circle-line"></i>  ' + finalExpense;
  document.getElementById("Totalearnings").innerHTML =
    '<i class="ri-money-rupee-circle-line"></i> ' + finalProfit;

  let yExpenseAndProfiteValues = [finalExpense, finalProfit];

  let chart4 = document.getElementById("dashboardChart");

  const dashboardChart = new Chart(chart4, {
    type: "doughnut",
    data: {
      labels: ["Expense", "Profit"],
      datasets: [
        {
          data: yExpenseAndProfiteValues,
          backgroundColor: ["#b91d47", "#00aba9"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 70,
      rotation: -Math.PI,
      circumference: Math.PI,
    },
  });
}

getExpenseAndProfiteOverView();

async function getVendorOverView() {
  let respone = await fetch("/admin/vendorOverView");
  let result = await respone.json();
  let xVendorOverVewValues = [];
  let yVendorOverVewValues = [];

  for (let i = 0; i < result.data.length; i++) {
    xVendorOverVewValues[i] = result.data[i].cat_name;
    yVendorOverVewValues[i] = result.data[i].cnt;
  }

  let chart5 = document.getElementById("myBarChart2").getContext("2d");

  const myChart5 = new Chart(chart5, {
    type: "bar",
    data: {
      labels: xVendorOverVewValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yVendorOverVewValues,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

getVendorOverView();

async function getUserOverView() {
  let table = document.getElementById("user_table");

  let str = " ";

  let respone = await fetch("/admin/usersOverView");
  let result = await respone.json();

  str += `<tr>`;
  for (const key in result.data[0]) {
    str += `<td>${key}</td>`;
  }
  str += `</tr>`;

  for (let i = 0; i < result.data.length; i++) {
    str += `<tr>`;
    for (let [key, value] of Object.entries(result.data[i])) {
      str += `<td> ${value} </td>`;
    }
    str += `</tr>`;
  }

  table.innerHTML = str;
  str = " ";
}

getUserOverView();

async function getProductOverView() {
  let table = document.getElementById("product_table");

  let str = " ";

  let respone = await fetch("/admin/productOverView");
  let result = await respone.json();
  str += `<tr>`;
  for (const key in result.data[0]) {
    str += `<td>${key}</td>`;
  }
  str += `</tr>`;

  for (let i = 0; i < result.data.length; i++) {
    str += `<tr>`;
    for (let [key, value] of Object.entries(result.data[i])) {
      str += `<td> ${value} </td>`;
    }
    str += `</tr>`;
  }

  table.innerHTML = str;
  str = " ";
}

getProductOverView();




async function getCardData() {

  let respone = await fetch("/admin/totalOrders");
  let result = await respone.json();

  document.getElementById('totalUsers').innerHTML = result.data.totalUser[0][0].cnt
  document.getElementById('totalOrders').innerHTML = result.data.totalOrder[0][0].cnt
  document.getElementById('totalSales').innerHTML = result.data.totalSale[0][0].cnt
  
}
getCardData();




let showResult = document.getElementById('12345');
let searchResults = [];
let currentFocus;
function searching(){

  let str = " ";

  let ul = document.getElementById('search') 
  let li = ul.getElementsByTagName('li');

  for(let i=0;i<li.length;i++){
    searchResults[i] = li[i].innerText;
  }

  showResult.innerHTML = str;
  str = " "

}

///////// not fully understand/////////
showResult.addEventListener("input", function(e) {

  e.preventDefault()

  let a, b, i, val = this.value;
 
  closeAllLists();
  if (!val) { return false;}
  currentFocus = -1;
  
  a = document.createElement("DIV");
  a.setAttribute("id", this.id + "autocomplete-list");
  a.setAttribute("class", "autocomplete-items");
  
  this.parentNode.appendChild(a);
 
  for (i = 0; i < searchResults.length; i++) {
  
    if (searchResults[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
     
      b = document.createElement("DIV");
      
      b.innerHTML = "<strong>" + searchResults[i].substr(0, val.length) + "</strong>";
      b.innerHTML += searchResults[i].substr(val.length);
      
      b.innerHTML += "<input type='hidden' id='inp' value='" + searchResults[i] + "'>";
    
      b.addEventListener("click", function(e) {

         
          showResult.value = this.getElementsByTagName("input")[0].value;
          
          closeAllLists();
      });
      a.appendChild(b);
    }
  }
});


showResult.addEventListener("keydown", function(e) {
  var x = document.getElementById(this.id + "autocomplete-list");
  if (x) x = x.getElementsByTagName("div");
  if (e.keyCode == 40) {
    
    currentFocus++;
  
  } else if (e.keyCode == 38) { 
    currentFocus--;
  
  } else if (e.keyCode == 13) {
   
    e.preventDefault();
    if (currentFocus > -1) {
      
      if (x) x[currentFocus].click();
    }
  }
});


function closeAllLists(elmnt) {
var x = document.getElementsByClassName("autocomplete-items");
for (var i = 0; i < x.length; i++) {
  if (elmnt != x[i] && elmnt != inp) {
    x[i].parentNode.removeChild(x[i]);
  }
}
}


let searchResultData = document.getElementById('searchResultData')
let data = document.getElementById('12345')

searchResultData.addEventListener('click', (e) => {

  let page = data.value;

  if(page == 'Main Dashboard'){
    window.location.href = '/admin/dashboard'
  } else if(page == 'Vendor Details'){
    window.location.href = '/admin/vendors'
  }else if(page == 'Sales'){
    window.location.href = '/admin/sales'
  }else if(page == 'Order Details'){
    window.location.href = '/admin/orders'
  }else if(page == 'pending verification'){
    window.location.href = '/admin/pending-verification'
  }else if(page == 'offers'){
    window.location.href = '/admin/offers'
  }else if(page == 'Users'){
    window.location.href = '/admin/users'
  }else if(page == 'Available Products'){
    window.location.href = '/admin/available-products'
  }else if(page == 'Contact To Vendor'){
    window.location.href = '/admin/contacttovendor'
  }else if(page == 'Notifications'){
    window.location.href = '/admin/notifications'
  }else if(page == 'Manage Values'){
    window.location.href = '/admin/values'
  }else if(page == 'Shipment details'){
    window.location.href = '/admin/shipment'
  }else if(page == 'Manage Values'){
    window.location.href = '/admin/taxmanage'
  }else if(page == 'Admin Revenue'){
    window.location.href = '/admin/revenue'
  }
})

async function goToProfile() {
  window.location.href = '/admin/view-profile'
}


////////////// add notification's number and style///////////
async function fetchunreadnotifications() {
  const response = await fetch("/admin/notificationsunreaded", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;

  
    if(results == null || results == undefined){
      document.getElementById("countNotification").style.display = 'none';
    }

    if(results.length == 0){
     document.getElementById("countNotification").style.display = 'none';
    }
    
    document.getElementById("countNotification").innerText =  "+"+ results.length
  }

fetchunreadnotifications()







//////////add  scroll Into view in admin panel//////
function scrollToSectionEar() {
  document.getElementById('third').scrollIntoView({
      behavior: 'smooth' 
  });
}



function scrollToSectionUser() {
  document.getElementById('four').scrollIntoView({
      behavior: 'smooth' 
  });
}

function scrollToSectionOrder() {
  document.getElementById('chart2').scrollIntoView({
      behavior: 'smooth' 
  });
}

function scrollToSectionSales() {
  document.getElementById('chart3').scrollIntoView({
      behavior: 'smooth' 
  });
}


/////////////pagination////////
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
  let uniurlProducts = `/admin/productOverView?page=1`

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

   ////for product Padination///


  function paginationNumberForProduct(page, lastPage) { 

    let paginationHtml = `<ul id="pagination">`
    
        if (page > 1) {
            paginationHtml += `<li><a href="/admin/productOverView/?page=1" id="first" onclick="getDataProduct(event)"> << </a></li>`;
        }
    
        if (page > 1) {
        paginationHtml += `<li><a href="/admin/productOverView/?page=${parseInt(page) -1}" id="second" onclick="getDataProduct(event)"> ${parseInt(page) -1} </a></li>`
        }
    
        paginationHtml +=  `<li><a href="/admin/productOverView/?page=${page}" id="mid" onclick="getDataProduct(event)"> ${page} </a></li>`
    
        if (page < lastPage) {
            paginationHtml += `<li><a href="/admin/productOverView/?page=${parseInt(page) +1}" id="seclast" onclick="getDataProduct(event)"> ${parseInt(page) +1} </a></li>`
        }
    
        if (page < lastPage) {
            paginationHtml += `
            <li><a href="/admin/productOverView/?page=${lastPage}" id="last" onclick="getDataProduct(event)"> >> </a></li>`;
        }
    
    paginationHtml += `</ul>`
    
    document.getElementById('paginationNumberForProduct').innerHTML = paginationHtml
    
    }

    async function getTableDataForProduct(url) {

      let str = " "
  
  
      let respone = await fetch(url)
  
        const result = await respone.json();
       
  
        let currPage = result.data.currentpage;
        let totalpage = result.data.totalPage

        if(result.data.results)
       
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
  
        document.getElementById('product_table').innerHTML = str
        str = " "
        
        paginationNumberForProduct(currPage, totalpage)
    }
  

 
    getTableDataForProduct(uniurlProducts);

    async function getDataProduct(e) {
      e.preventDefault();
      
      let id = e.target.id
      
      if(id == 'first'){
        getTableDataForProduct(e.target.href)
      }else if(id == 'second'){
        getTableDataForProduct(e.target.href)
      }else if(id == 'mid'){    
        getTableDataForProduct(e.target.href)
      }else if(id == 'seclast'){
        getTableDataForProduct(e.target.href)
      }else if(id == 'last'){
        getTableDataForProduct(e.target.href)
      }
  }


function logout() {
  // let response = confirm("Are you sure??");

  Swal.fire({
    text: "Are you sure you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Logout"
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/admin/logout';
    }
  });
}
  
