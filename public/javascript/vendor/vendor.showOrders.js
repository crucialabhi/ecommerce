const getOrderDetail = async () => {
    const url = "/vendor/getALlOrderDetails";
    try {
      const response = await fetch(url, {
        method: "GET",
       
      });

      const results = await response.json();
      if(!results.data.success){
        alert(results.message)
        window.location.href = '/auth/vendor-login'
      }
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
      tableDiv.appendChild(table);
    } catch (error) {
      console.log(error);
    }
  };
  getOrderDetail();

  async function filterSelect(t) {

    const url = `/vendor/filterResult?FilterValue=${t.value}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      
      });

      const results = await response.json();
      if(!results.data.success){
        alert(results.message)
        window.location.href = '/auth/vendor-login'
      }
      let resultData = results.data.FilterResult;

      let headers = Object.keys(resultData[0]);

      const tableDiv = document.getElementById("orderDetailDiv");
      tableDiv.innerHTML = ''
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