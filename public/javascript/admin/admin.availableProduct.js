let barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];

for (let i = 0; i < 25; i++) {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  barColors.push(randomColor);
}

async function getProductDetails() {
  let respone = await fetch("/admin/product-details");
  let result = await respone.json();
  let xOrderOverVewValues = [];
  let yOrderOverVewValues = [];
  for (let i = 0; i < result.data.length; i++) {
    xOrderOverVewValues[i] = result.data[i].cat_name;
    yOrderOverVewValues[i] = result.data[i].cnt;
  }

  let chart1 = document.getElementById("myPieChart").getContext("2d");

  const myChart2 = new Chart(chart1, {
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
getProductDetails();

async function getProductDetailsOfElectronics() {
  let respone = await fetch("/admin/product-details-electronics");
  let result = await respone.json();
  let xOrderOverVewValues = [];
  let yOrderOverVewValues = [];
  let parentValue = [];

  for (let i = 0; i < result.data.length; i++) {
    xOrderOverVewValues[i] = result.data[i].product_name;
    yOrderOverVewValues[i] = result.data[i].cnt;
    parentValue.push("Electonics");
  }

  data = [
    {
      type: "treemap",
      labels: xOrderOverVewValues,
      parents: parentValue,
      values: yOrderOverVewValues,
    },
  ];

  Plotly.newPlot("myDivElectronics", data);
}
getProductDetailsOfElectronics();

async function getProductDetailsOfClothes() {
  let respone = await fetch("/admin/product-details-clothes");
  let result = await respone.json();
  let xOrderOverVewValues = [];
  let yOrderOverVewValues = [];
  let parentValue = [];

  for (let i = 0; i < result.data.length; i++) {
    xOrderOverVewValues[i] = result.data[i].product_name;
    yOrderOverVewValues[i] = result.data[i].cnt;
    parentValue.push("Cloths");
  }

  data = [
    {
      type: "treemap",
      labels: xOrderOverVewValues,
      parents: parentValue,
      values: yOrderOverVewValues,
    },
  ];

  Plotly.newPlot("myDivClothes", data);
}
getProductDetailsOfClothes();

async function getAllProductListing() {
  let productTable = document.getElementById("allProduct");

  let str = " ";

  let respone = await fetch("/admin/productOverView");
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

  productTable.innerHTML = str;
  str = " ";
}

getAllProductListing();

function paginationNumber(page, lastPage) {
  let paginationHtml = `<ul id="pagination">`;

  if (page > 1) {
    paginationHtml += `<li><a href="/admin/productOverView/?page=1" id="first" onclick="getData(event)"> << </a></li>`;
  }

  if (page > 1) {
    paginationHtml += `<li><a href="/admin/productOverView/?page=${parseInt(page) - 1
      }" id="second" onclick="getData(event)"> ${parseInt(page) - 1} </a></li>`;
  }

  paginationHtml += `<li><a href="/admin/productOverView/?page=${page}" id="mid" onclick="getData(event)"> ${page} </a></li>`;

  if (page < lastPage) {
    paginationHtml += `<li><a href="/admin/productOverView/?page=${parseInt(page) + 1
      }" id="seclast" onclick="getData(event)"> ${parseInt(page) + 1} </a></li>`;
  }

  if (page < lastPage) {
    paginationHtml += `
          <li><a href="/admin/productOverView/?page=${lastPage}" id="last" onclick="getData(event)"> >> </a></li>`;
  }

  paginationHtml += `</ul>`;

  document.getElementById("paginationNumber").innerHTML = paginationHtml;
}

let uniurlUsers = `/admin/productOverView?page=1`;

async function getTableData(url) {
  let str = " ";

  let respone = await fetch(url);

  const result = await respone.json();


  let currPage = result.data.currentpage;
  let totalpage = result.data.totalPage;

  str += `<tr>`;
  for (let [key, value] of Object.entries(result.data.results[0])) {
    str += `<td> ${key} </td>`;
  }
  str += `</tr>`;

  for (let i = 0; i < result.data.results.length; i++) {
    str += `<tr>`;

    for (let [key, value] of Object.entries(result.data.results[i])) {
      str += `<td> ${value} </td>`;
    }
  }
  str += `</tr>`;

  document.getElementById("allProduct").innerHTML = str;
  str = " ";

  paginationNumber(currPage, totalpage);
}

//// for userPagination////
getTableData(uniurlUsers);

async function getData(e) {
  e.preventDefault();

  let id = e.target.id;

  if (id == "first") {
    getTableData(e.target.href);
  } else if (id == "second") {
    getTableData(e.target.href);
  } else if (id == "mid") {
    getTableData(e.target.href);
  } else if (id == "seclast") {
    getTableData(e.target.href);
  } else if (id == "last") {
    getTableData(e.target.href);
  }
}


async function searchproduct() {
  document.getElementById("allProduct").innerHTML = ""
  let table = document.getElementById("allProduct");
  let query = document.getElementById("productinput").value;
  // if search query is empty than return original page
  if (query == "") {
    getAllProductListing()
    return
  }
  let formdata = new FormData();
  formdata.append("query", query);

  const response = await fetch("/admin/seachproduct", {
    method: "POST",
    body: formdata,
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  let results = json.data;
  table.innerHTML = `<tr>
                  <th>product name</th>
                  <th>price</th>
                  <th>available stock</th>
                </tr>`
  if (results.length == 0) {
    const row = `<tr>
  <td>No products available with this search</td>
  </tr>`;
    table.innerHTML += row;
  }
  else {
    results.forEach((result) => {
      const row = `<tr>
                    <td>${result.product_name}</td>
                    <td>${result.price}</td>
                    <td>${result.available_stock}</td>
                    </tr>`;
      table.innerHTML += row;
    })
  }
}