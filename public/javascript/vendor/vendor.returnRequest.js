const showReturnRequest = async () => {
    let btn1 = document.getElementById("showReturnRequest");
    btn1.classList.add("active");
    let btn2 = document
      .getElementById("showReturnRequestHistoy")
      .classList.remove("active");
    const url = "/vendor/returnRequest";
    try {
      const response = await fetch(url, {
        method: "GET",
     
      });

      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      let ReturnRequestData = results.data.returnRequestDetails;

      let Resultlength = results.data.returnRequestDetails.length;
      let div = document.getElementById("ReturnRequestDiv");
       document.getElementById("paginationButtons").style.display = "block"
      if (Resultlength == 0) {
        div.innerHTML = `<div id="noRequest">No Return Request<div/>`;
        document.getElementById("paginationButtons").style.display = "none";
      } else {
        div.innerHTML = "";
      }

      let headers = Object.keys(ReturnRequestData[0]);
     

      const tableDiv = document.getElementById("ReturnRequestDiv");
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
      const thAccept = document.createElement("th");
      thAccept.innerHTML = "Accept";
      tr1.appendChild(thAccept);

      table.appendChild(tr1);
      

      const thReject = document.createElement("th");
      thReject.innerHTML = "Reject";
      tr1.appendChild(thReject);

      table.appendChild(tr1);

      for (let i = 0; i < ReturnRequestData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestData[i][headers[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${results.data.returnRequestDetails[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${results.data.returnRequestDetails[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table.appendChild(tr);
      }
      tableDiv.appendChild(table);

      getNineRequests();
    } catch (error) {
      console.log(error);
    }
  };
  showReturnRequest();

  const getNineRequests = async () => {
    const url = "/vendor/getFirstNineRequest";
    try {
      const RequestResponse = await fetch(url, {
        method: "GET",
        // headers: {
        //   Authorization: localStorage.getItem("token"),
        // },
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getFirstNineRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }
      const thAccept1 = document.createElement("th");
      thAccept1.innerHTML = "Accept";
      tr2.appendChild(thAccept1);

      table1.appendChild(tr2);

      const thReject1 = document.createElement("th");
      thReject1.innerHTML = "Reject";
      tr2.appendChild(thReject1);

      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${Requestresults.data.getFirstNineRequests[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${Requestresults.data.getFirstNineRequests[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
  };

  async function first_page_handler() {
    let btn1 = document
      .getElementById("showReturnRequest")
      .classList.contains("active");
      if(btn1){
        const url = "/vendor/getRemainingRequest";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ First_Page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }
      const thAccept1 = document.createElement("th");
      thAccept1.innerHTML = "Accept";
      tr2.appendChild(thAccept1);

      table1.appendChild(tr2);

      const thReject1 = document.createElement("th");
      thReject1.innerHTML = "Reject";
      tr2.appendChild(thReject1);

      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }




      }else{
        const url = "/vendor/getRemainingRequestHistory";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ First_Page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);
     

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }


      table1.appendChild(tr2);


      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
  

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
      }
    
  }

  async function prev_page_handler() {
    let btn1 = document
      .getElementById("showReturnRequest")
      .classList.contains("active");
      if(btn1){
        const url = "/vendor/getRemainingRequest";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Previous_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }
      const thAccept1 = document.createElement("th");
      thAccept1.innerHTML = "Accept";
      tr2.appendChild(thAccept1);

      table1.appendChild(tr2);

      const thReject1 = document.createElement("th");
      thReject1.innerHTML = "Reject";
      tr2.appendChild(thReject1);

      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }





      }else{
        const url = "/vendor/getRemainingRequestHistory";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Previous_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }


      table1.appendChild(tr2);


      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
  

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
      }
    
   
  }

  async function next_page_handler() {
    let btn1 = document
      .getElementById("showReturnRequest")
      .classList.contains("active");
      if(btn1){
        const url = "/vendor/getRemainingRequest";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Next_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }
      const thAccept1 = document.createElement("th");
      thAccept1.innerHTML = "Accept";
      tr2.appendChild(thAccept1);

      table1.appendChild(tr2);

      const thReject1 = document.createElement("th");
      thReject1.innerHTML = "Reject";
      tr2.appendChild(thReject1);

      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
      }

      else{
        const url = "/vendor/getRemainingRequestHistory";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Next_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }


      table1.appendChild(tr2);


      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
  

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
      }
    
  }

  async function last_page_handler() {
    let btn1 = document
      .getElementById("showReturnRequest")
      .classList.contains("active");
      if(btn1){
        const url = "/vendor/getRemainingRequest";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Last_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }
      const thAccept1 = document.createElement("th");
      thAccept1.innerHTML = "Accept";
      tr2.appendChild(thAccept1);

      table1.appendChild(tr2);

      const thReject1 = document.createElement("th");
      thReject1.innerHTML = "Reject";
      tr2.appendChild(thReject1);

      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
        const tdAccept = document.createElement("td");
        tdAccept.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="AcceptBtn" onclick="Accept(this)">Accept</button>`;
        tr.appendChild(tdAccept);

        const tdReject = document.createElement("td");
        tdReject.innerHTML = `<button id="${Requestresults.data.getRemainingRequests[i].refund_id}" class="RejectBtn" onclick="Reject(this)">Reject</button>`;
        tr.appendChild(tdReject);

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }

      }


      else{
        const url = "/vendor/getRemainingRequestHistory";
    try {
      const RequestResponse = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Last_page: 0 }),
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getRemainingRequests;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }


      table1.appendChild(tr2);


      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
  

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
      }
    
  }

  async function Accept(acceptBtn) {
    const url = "/vendor/updateReturnRequestAccept";

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

        
        },
        body: JSON.stringify({ acceptBtnID: acceptBtn.id }),
      });
      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      } else {
        // Alert
        Swal.fire({
          position: "top-center",
          icon: "success",
          iconColor: 'hsl(176, 88%, 27%)',
          title: "Return Request Accepted",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: "custom-alert" },
        });
        showReturnRequest();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function Reject(rejectBtn) {
    const url = "/vendor/updateReturnRequestReject";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ RejectBtnID: rejectBtn.id }),
      });
      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      } else {
        // Alert
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Return Request Rejected",
          showConfirmButton: false,
          timer: 1000,
          customClass: { popup: "custom-alert" },
        });
        showReturnRequest();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showReturnRequestHistoy = async () => {
    let btn1 = document.getElementById("showReturnRequestHistoy");
    btn1.classList.add("active");
    let btn2 = document
      .getElementById("showReturnRequest")
      .classList.remove("active");
    const url = "/vendor/showReturnRequestHistory";
    try {
      const response = await fetch(url, {
        method: "GET",

      
      });

      const results = await response.json();
      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      }

      let ReturnRequestHistoryData = results.data.returnRequestHistoryDetails;

      let Resultlength = results.data.returnRequestHistoryDetails.length;
      document.getElementById("paginationButtons").style.display = "block"
      if (Resultlength == 0) {
        let div = document.getElementById("ReturnRequestDiv");
        div.innerHTML = `<div id="noRequest">No Return Request History<div/>`;
        document.getElementById("paginationButtons").style.display = "none";
      }
      
      let headers = Object.keys(ReturnRequestHistoryData[0]);
  

      const tableDiv = document.getElementById("ReturnRequestDiv");
      tableDiv.innerHTML = "";
      const table = document.createElement("table");
      table.border = "1";
      table.style.boarderCollapse = "";

      const tr1 = document.createElement("tr");
     
      for (let i = 0; i < headers.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers[i];
        console.log(th);
        tr1.appendChild(th);
        console.log(tr1);
     
      }
   

      table.appendChild(tr1);
      console.log(table);
      

      for (let i = 0; i < ReturnRequestHistoryData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestHistoryData[i][headers[j]];
          tr.appendChild(td);
        }

        table.appendChild(tr);
        console.log(table);
        
      }
      tableDiv.appendChild(table);

      HistoryFirstNineRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const HistoryFirstNineRequests = async () => {
    const url = "/vendor/getNineRequestHIstory";
    try {
      const RequestResponse = await fetch(url, {
        method: "GET",
        headers: {
          // Authorization: localStorage.getItem("token"),
        },
      });

      const Requestresults = await RequestResponse.json();
      if (!Requestresults.data.success) {
        alert(Requestresults.message);
        window.location.href = "/auth/vendor-login";
      }
      document.getElementById("current_page_id").innerText =
        Requestresults.data.current_page;
      document.getElementById("total_pages_id").innerText =
        Requestresults.data.total_pages;
      let ReturnRequestPaginationData =
        Requestresults.data.getFirstNineRequestsHistory;
      let headers1 = Object.keys(ReturnRequestPaginationData[0]);

      const tableDiv1 = document.getElementById("ReturnRequestDiv");
      tableDiv1.innerHTML = "";
      const table1 = document.createElement("table");
      table1.border = "1";
      table1.style.boarderCollapse = "";

      const tr2 = document.createElement("tr");
      for (let i = 0; i < headers1.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
      }


      table1.appendChild(tr2);


      table1.appendChild(tr2);

      for (let i = 0; i < ReturnRequestPaginationData.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < headers1.length; j++) {
          const td = document.createElement("td");
          td.innerHTML = ReturnRequestPaginationData[i][headers1[j]];
          tr.appendChild(td);
        }
  

        table1.appendChild(tr);
      }
      tableDiv1.appendChild(table1);
    } catch (error) {
      console.log(error);
    }
  };