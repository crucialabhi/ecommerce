let monthname = ['January', 'February','March','April', 'May', 'June','July','Auguest','September','Octomber','November','December']

async function getMonthrevenewAdmin() {

    let chart1 = document.getElementById("myLineChart1").getContext("2d");

    let respone = await fetch('/admin/get-admin-month-revenew');
    let result = await respone.json();
    

    let MonthChart = result.data;
        let keys = [];
        let values = [];
        MonthChart.forEach((element) => {


            let month_name = monthname[(element.month) - 1];

          keys.push(month_name);
          values.push(element.total_admin_commission);
        });


    document.getElementById("thismonthrev").innerHTML = '<i class="ri-money-rupee-circle-line"></i> ' +  result.data[0].total_admin_commission.toFixed(2);

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
getMonthrevenewAdmin()


async function getYearrevenewAdmin() {

    let chart1 = document.getElementById("myLineChart2").getContext("2d");

    let respone = await fetch('/admin/get-admin-year-revenew');
    let result = await respone.json();
    

    let MonthChart = result.data;
        let keys = [];
        let values = [];
        MonthChart.forEach((element) => {

          keys.push(element.year);
          values.push(element.total_admin_commission);
        });


    document.getElementById("thisyearrev").innerHTML ='<i class="ri-money-rupee-circle-line"></i> ' + result.data[0].total_admin_commission.toFixed(2);
    

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
getYearrevenewAdmin()


async function getAdminRevenueGrpVendor() {
    let table = document.getElementById("revenue_table");
  
    let str = " ";
  
    let respone = await fetch("/admin/get-vendor-wise-revenue");
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
  
getAdminRevenueGrpVendor();
  

async function getTotalAdminRev() {

  let respone = await fetch('/admin/get-total-revenue');
  let result = await respone.json();

  console.log(result);
  
  if(result.data.result1[0] > 1){
    document.getElementById('lastyearrev').innerHTML =  "0"
  }else{
    document.getElementById('lastyearrev').innerHTML = '<i class="ri-money-rupee-circle-line"></i> ' + result.data.result1[0].Total_revenue
  }

  if(result.data.result2[0] > 1){

    document.getElementById('lastmonthrev').innerHTML = '<i class="ri-money-rupee-circle-line"></i> ' + result.data.result2[0].total_admin_commission

  }else{
    document.getElementById('lastmonthrev').innerHTML = "No Revenue in  Last Month"
    document.getElementById('lastmonthrev').style.color = "red"
  }
  
}

getTotalAdminRev()