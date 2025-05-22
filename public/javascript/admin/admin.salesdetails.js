
      async function getMonthrevenew() {

        const ctx = document.getElementById("myChart");

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
    
        const myChart1 = new Chart(ctx, {
          type: "line",
          data: {
            labels: keys,
            datasets: [
              {
                label : " ",
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
            legend: { display: false },
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
            },
          },
        });
    }
    getMonthrevenew()


    

async function fetchdataofwearsales() {
  const response = await fetch("/admin/fetchdataofwearsales", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  const ctx3 = document.getElementById("barchart");
  new Chart(ctx3, {
    type: "pie",
    data: {
      labels: results.productname,
      datasets: [
        {
          label: "no. of sales",
          data: results.no,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
async function fetchdataofelectronicsales() {
  const response = await fetch("/admin/fetchdataofelectronicsales", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
  const ctx2 = document.getElementById("pieChart");
  new Chart(ctx2, {
    type: "pie",
    data: {
      labels: results.productname,
      datasets: [
        {
          label: "no. of sales",
          data: results.no,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}


async function fetchsalesdatacatwise() {
  const response = await fetch("/admin/fetchdatacatwise", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  let results = json.data;
 
  const ctx4 = document.getElementById("catwisesales");
  new Chart(ctx4, {
    type: "line",
    data: {
      labels: results.cat_id,
      datasets: [
        {
          label: "no. of sales",
          data: results.total_order,
          borderWidth: 1,
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
fetchdataofelectronicsales();
fetchdataofwearsales()
fetchsalesdatacatwise()