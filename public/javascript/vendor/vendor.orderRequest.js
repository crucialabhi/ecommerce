async function getOrderRequests() {
    try {
      document.getElementById('orderRequestBtn').classList.add('activeBtn')
      document.getElementById('orderRequestBtn').classList.remove('inActiveBtn')
      document.getElementById('orderHistoryBtn').classList.add('inActiveBtn')
      document.getElementById('orderHistoryBtn').classList.remove('activeBtn')
      const url = `/vendor/orderRequests/data`;
      const response = await fetch(url, {
      
      });
      const json = await response.json();
      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("orderRequestsTable").style.display = "block";
      document.getElementById("parentDiv").style.display = "none";
      if (json.data.orderRequestsData.length == 0) {
        document.getElementById("orderRequestsTable").innerHTML =
          "No data";
        return;
      }
      let table_html_code = `<table><tr>
                <th>Order Id</th>
                <th>User Email</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Order Date</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>City</th>
                <th>Accept Order</th>
                <th>Reject Order</th>
            </tr>`;
            
      for (let i = 0; i < json.data.orderRequestsData.length; i++) {
        if(i==0){
          table_html_code += `<tr><td colspan="10">
    <div class="group_id_row"><div>Group Id: ${json.data.orderRequestsData[i].group_id}</div> <div><button id="${json.data.orderRequestsData[i].group_id}"  class="acceptAllOrderBtn" onclick="handleAcceptAllOrder(this.id)">Accept all</button></div></div>
     </td></tr>`
        }else if(json.data.orderRequestsData[i].group_id !== json.data.orderRequestsData[i-1].group_id){
          table_html_code += `<tr><td colspan="10"><div class="group_id_row"><div>Group Id: ${json.data.orderRequestsData[i].group_id}</div> <div><button id="${json.data.orderRequestsData[i].group_id}"  class="acceptAllOrderBtn" onclick="handleAcceptAllOrder(this.id)">Accept all</button></div></div></td></tr>`
        }
        
        table_html_code += `<tr>
                <td>${json.data.orderRequestsData[i].order_id}</td>
                <td>${json.data.orderRequestsData[i].email}</td>
                <td>${json.data.orderRequestsData[i].product_name}</td>
                <td>${json.data.orderRequestsData[i].product_price}</td>
                <td>${json.data.orderRequestsData[i].order_date}</td>
                <td>${json.data.orderRequestsData[i].address}</td>
                <td>${json.data.orderRequestsData[i].pin_code}</td>
                <td>${json.data.orderRequestsData[i].city}</td>
                <td><button id="${json.data.orderRequestsData[i].order_id}"  class="acceptOrderBtn" onclick="handleAcceptOrder(this.id)">Accept order</button></td>
                <td><button id="${json.data.orderRequestsData[i].order_id}"  class="rejectOrderBtn" onclick="handleRejectOrder(this.id, ${json.data.orderRequestsData[i].product_id})">Reject order</button></td>
            </tr>`;
      }

      table_html_code += `<table>`;

      document.getElementById("orderRequestsTable").innerHTML =
        table_html_code;
    } catch (error) {
      console.log(error);
    }
  }

  getOrderRequests();

  async function handleAcceptOrder(id) {
    try {
      const url = `/vendor/orderRequests/acceptOrder?orderId=${id}`;
      const response = await fetch(url, {
       
      });
      const json = await response.json();
      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      } else {
        // Alert
        Swal.fire({
          position: "top-center",
          icon: "success",
          iconColor: 'hsl(176, 88%, 27%)',
          title: "Order accepted",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: "custom-alert" },
        });
        getOrderRequests();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRejectOrder(id, productId) {
    try {
      const url = `/vendor/orderRequests/rejectOrder?orderId=${id}&productId=${productId}`;
      const response = await fetch(url, {
        
      });
      const json = await response.json();
      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      } else {
        // Alert
        Swal.fire({
          position: "top-center",
          icon: "success",
          iconColor: 'hsl(176, 88%, 27%)',
          title: "Order rejected",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: "custom-alert" },
        });
        getOrderRequests();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getOrderHistory = async () => {
    try {
      document.getElementById('orderRequestBtn').classList.add('inActiveBtn')
      document.getElementById('orderRequestBtn').classList.remove('activeBtn')
      document.getElementById('orderHistoryBtn').classList.add('activeBtn')
      document.getElementById('orderHistoryBtn').classList.remove('inActiveBtn')
      const url = "/vendor/getALlOrderDetails";
      const response = await fetch(url, {
        method: "GET",
       
      });

      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      if(results.data.orderDetailResult.length == 0){
        
        document.getElementById("orderDetailDiv").innerHTML = 'There is no order history'
        return
      }
      
      document.getElementById("filter").innerHTML = `<p id="filterPara">Filter By Order Status</p>
      <select
        name="filterSelect"
        id="filterSelect"
        onchange="filterSelect(this)"
      >
        <option value="">Select order status</option>
        <option value="vendorVerification">Vendor Verification</option>
        <option value="Pending">Pending</option>
        <option value="complete">Complete</option>
        <option value="rejected">Rejected</option>
      </select>`;
      document.getElementById("parentDiv").style.display = "block";
      document.getElementById("orderRequestsTable").style.display = "none";
      let resultData = results.data.orderDetailResult;

      let headers = Object.keys(resultData[0]);

      const tableDiv = document.getElementById("orderDetailDiv");
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
      tableDiv.innerHTML = "";
      tableDiv.appendChild(table);
    } catch (error) {
      console.log(error);
    }
  };
  // getOrderDetail();

  async function filterSelect(t) {

    const url = `/vendor/filterResult?FilterValue=${t.value}`;
    try {
      const response = await fetch(url, {
        method: "GET",
       
      });

      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }
      let resultData = results.data.FilterResult;

      const tableDiv = document.getElementById("orderDetailDiv");

      if(resultData.length == 0){
        tableDiv.innerHTML = "No result";
      }

      let headers = Object.keys(resultData[0]);

      tableDiv.innerHTML = "";
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
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAcceptAllOrder(id) {
    try {
      const url = `/vendor/orderRequests/acceptAllOrder?groupId=${id}`;
      const response = await fetch(url, {
        // headers: {
        //   Authorization: localStorage.getItem("token"),
        // },
      });
      const json = await response.json();
      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      } else {
        // Alert
        Swal.fire({
          position: "top-center",
          icon: "success",
          iconColor: 'hsl(176, 88%, 27%)',
          title: "All Orders are accepted",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: "custom-alert" },
        });
        getOrderRequests();
      }
    } catch (error) {
      console.log(error);
    }
  }