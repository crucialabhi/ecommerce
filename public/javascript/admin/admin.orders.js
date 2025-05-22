
let barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];

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
  


async function getOrdersDetails() {
    let table = document.getElementById("orderTabel");
  
    let str = " ";
  
    let respone = await fetch("/admin/order-listing");
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
  getOrdersDetails()



  function paginationNumber(page, lastPage) { 

    let paginationHtml = `<ul id="pagination">`
    
        if (page > 1) {
            paginationHtml += `<li><a href="/admin/order-listing/?page=1" id="first" onclick="getData(event)"> << </a></li>`;
        }
    
        if (page > 1) {
        paginationHtml += `<li><a href="/admin/order-listing/?page=${parseInt(page) -1}" id="second" onclick="getData(event)"> ${parseInt(page) -1} </a></li>`
        }
    
        paginationHtml +=  `<li><a href="/admin/order-listing/?page=${page}" id="mid" onclick="getData(event)"> ${page} </a></li>`
    
        if (page < lastPage) {
            paginationHtml += `<li><a href="/admin/order-listing/?page=${parseInt(page) +1}" id="seclast" onclick="getData(event)"> ${parseInt(page) +1} </a></li>`
        }
    
        if (page < lastPage) {
            paginationHtml += `
            <li><a href="/admin/order-listing/?page=${lastPage}" id="last" onclick="getData(event)"> >> </a></li>`;
        }
    
    paginationHtml += `</ul>`
    
    document.getElementById('paginationNumber').innerHTML = paginationHtml
    
    }
    
    let uniurlUsers =`/admin/order-listing?page=1`
  
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
  
        document.getElementById('orderTabel').innerHTML = str
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