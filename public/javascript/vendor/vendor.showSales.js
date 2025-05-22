const getlineChartData = async () => {
  const url = "/vendor/getMonthSalesData";
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    let MonthChart = results.data.getMonthSales;
    if (results.data.getMonthSales.length == 0) {
      document.getElementById('MonthChartCanvas').innerHTML = `<div class="noChartData">No Month wise sales data</div>`
      document.getElementById('revenueChart').innerHTML = `<div class="noChartData">No monthly revenue data available</div>`
    } else {
      let keys = [];
      let values = [];
      MonthChart.forEach((element) => {
        keys.push(element.month_name);
        values.push(element.TotalSales);
      });

      let revenueKey = [];
      let revenueValue = [];

      MonthChart.forEach((element) => {
        revenueKey.push(element.month_name);
        revenueValue.push(element.MonthlyRevenue);
      });

      const MonthLineChart = document.getElementById("lineChart");

      new Chart(MonthLineChart, {
        type: "line",
        data: {
          labels: keys,
          datasets: [
            {
              label: "",
              data: values,
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

      const totalRevenue = document.getElementById('revenueLinechart');
      new Chart(totalRevenue, {
        type: "line",
        data: {
          labels: revenueKey,
          datasets: [
            {
              label: "",
              data: revenueValue,
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
  } catch (error) {
    console.log(error);
  }
};
getlineChartData();

const getBarChartData = async () => {
  const url = "/vendor/getCityWiseSalesData";
  try {
    const response = await fetch(url, {
      method: "GET",

    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    let CityChart = results.data.getCitySalesData;
    if (CityChart.length == 0) {
      document.getElementById('citySalesChartDiv').innerHTML = `<div class="noChartData">No City wise sales data</div>`
    }
    let keys = [];
    let values = [];
    CityChart.forEach((element) => {
      keys.push(element.city);
      values.push(element.Total_sales_of_city);
    });

    const CityBarChart = document.getElementById("BarChart");

    new Chart(CityBarChart, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: "",
            data: values,
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
  } catch (error) {
    console.log(error);
  }
};
getBarChartData();