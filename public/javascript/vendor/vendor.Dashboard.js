const getOrderChartData = async () => {
    const url = "/vendor/getOrderChartData";
    try {
      const response = await fetch(url, {
        method: "GET",
        
      });

      const results = await response.json();

      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      let orderChart = results.data.orderChartDetails;
      let orderChartLength = results.data.orderChartDetails.length
  if(orderChartLength == 0){
    document.getElementById('OrderCanvasDiv').innerHTML = `<div class="noOrderChartData">No orders data<div/>`
  }else{
    let keys = [];
      let values = [];
      orderChart.forEach((element) => {
        keys.push(element.products_name);
        values.push(element.TotalOrders);
      });

      const orderBarChart = document.getElementById("barChart1");

      new Chart(orderBarChart, {
        type: "doughnut",
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
    
  }

      
    } catch (error) {
      console.log(error);
    }
  };
  getOrderChartData();

  const getinventoryChartData = async () => {
    const url = "/vendor/getInventoryData";
    try {
      const response = await fetch(url, {
        method: "GET",
      
      });

      const results = await response.json();

      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      let inventoryChart = results.data.getInventoryChartData;

      if(results.data.getInventoryChartData.length == 0){
         document.getElementById('InventoryChartDiv').innerHTML = `<div class="noOrderChartData">No Inventory data<div/>`
      }
      let keys = [];
      let values = [];
      inventoryChart.forEach((element) => {
        keys.push(element.product_name);
        values.push(element.available_stock);
      });

      const barChart2 = document.getElementById("barChart2");

      new Chart(barChart2, {
        type: "bar",
        data: {
          labels: keys,
          datasets: [
            {
              data: values,
              borderWidth: 1,
              label: keys,
            },
          ],
        },
        options: {
          // legend: { display: true },
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
  getinventoryChartData();

  const getShipStatusChartData = async () => {
    const url = "/vendor/getShippingData";
    try {
      const response = await fetch(url, {
        method: "GET",
        
      });

      const results = await response.json();

      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      let shippingStatusChart = results.data.shippingStatusResult;
      if(results.data.shippingStatusResult.length == 0){
        document.getElementById('shippingChartDiv').innerHTML = `<div class="noOrderChartData">No Shipping status data<div/>`

      }else{
        let keys = [];
      let values = [];
      shippingStatusChart.forEach((element) => {
        keys.push(element.order_status);
        values.push(element.totalorders);
      });

      const piechart = document.getElementById("piechart");

      new Chart(piechart, {
        type: "pie",
        data: {
          labels: keys,
          datasets: [
            {
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
      }
     
    } catch (error) {
      console.log(error);
    }
  };
  getShipStatusChartData();

  const getTrendingProductData = async () => {
    const url = "/vendor/showTrendingProducts";
    try{
      const response = await fetch(url,{
        method:"GET",
       
      })

      const results = await response.json();
      // if (!results.data.success) {
      //   alert(results.message);
      //   window.location.href = "/auth/vendor-login";
      // }

    
      let resultData = results.data.getTrendingProducts;

      if (resultData.length != 0) {
        let headers = Object.keys(resultData[0]);

        const tableDiv = document.getElementById("trendingTable");
        const table = document.createElement("table");
        table.border = "1";
        table.style.boarderCollapse = "";

        const tr1 = document.createElement("tr");
        for (let i = 0; i < headers.length; i++) {
          const th = document.createElement("th");
          th.innerHTML = headers[i];
          tr1.appendChild(th);
        }
        table.appendChild(tr1);

        for (let i = 0; i < resultData.length; i++) {
          const tr = document.createElement("tr");
          for (let j = 0; j < headers.length; j++) {
            const td = document.createElement("td");
            td.innerHTML = resultData[i][headers[j]];
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
        tableDiv.appendChild(table);
      }
      else{
        document.getElementById('trendingTable').innerHTML+= `<div class="noOrderChartData">No Trending Products data<div/>`
      }
    } catch (error) {
      console.log(error);
    }
  };
  getTrendingProductData();

  const getTotalOrders = async() =>{
      const url = "/vendor/getTotalOrders";
      try{
        const response = await fetch(url,{
        method:"GET",
      
      })

      const results = await response.json();
     

      // let [TotalOrder] = document.getElementsByClassName('totalOrder')
      let TotalOrder = results.data.totalOrderCount[0].TotalOrders;
      document.getElementById("countOrder").innerHTML = TotalOrder;
    } catch (error) {
      console.log(error);
    }
  };
  getTotalOrders();
  


  const getTotalProducts = async() =>{
      const url = "/vendor/getTotalProducts";
      try{
        const response = await fetch(url,{
        method:"GET",
        
      })

      const results = await response.json();
      
      // let [TotalOrder] = document.getElementsByClassName('totalOrder')
      let TotalProduct = results.data.totalProductCount[0].TotalProducts;
      document.getElementById("countProduct").innerHTML = TotalProduct;
    } catch (error) {
      console.log(error);
    }
  };
  getTotalProducts();


  const getRevenue = async() =>{
      const url = "/vendor/getTotalRevenue";
      try{
        const response = await fetch(url,{
        method:"GET",
        
      })

      const results = await response.json();
      

      if (results.data.totalRevenue[0].TotalRevenue == null) {
        document.getElementById("countRevenue").innerHTML = 0;
        return;
      }

      // let [TotalOrder] = document.getElementsByClassName('totalOrder')
      let TotalRevenue = results.data.totalRevenue[0].TotalRevenue;
      document.getElementById("countRevenue").innerHTML = TotalRevenue.toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };
  getRevenue();


  const getPendingOrdersCount = async() =>{
      const url = "/vendor/getTotalPendingOrders";
      try{
        const response = await fetch(url,{
        method:"GET",
        
      })

      const results = await response.json();
     

      // let [TotalOrder] = document.getElementsByClassName('totalOrder')
      let TotalPendingOrders =
        results.data.totalPendingOrders[0].TotalPendingOrders;
      document.getElementById("PendingOrders").innerHTML =
        TotalPendingOrders;
    } catch (error) {
      console.log(error);
    }
  };
  getPendingOrdersCount();



  