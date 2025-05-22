document.getElementById("searchInput").value = "";
const getProducts = async () => {
  const url = "/vendor/getAllProducts";
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    console.log("All products result", results);
    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.showProductsResult.length);
    if (results.data.showProductsResult.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("paginationButtons").style.display = "none";
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.showProductsResult.length; i++) {
        let imagesArray =
          results.data.showProductsResult[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.showProductsResult[i].product_name}</h4>
   
      <div class="otherDetail">
      <p> Available stock : ${results.data.showProductsResult[i].available_stock}</p>
      <p> Stock : ${results.data.showProductsResult[i].stock}</p>
      <p> Size : ${results.data.showProductsResult[i].size}</p>
      <p> Color : ${results.data.showProductsResult[i].color}</p>
      <p> Price : ${results.data.showProductsResult[i].price}</p>

      
      <i onclick="edit(this)" id=${results.data.showProductsResult[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>
      <i onclick="deleteProduct(this)" id=${results.data.showProductsResult[i].vendor_product_id} class="fa-solid fa-trash"></i>
    
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.showProductsResult[i].vendor_product_id}>Addddd stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.showProductsResult[i].vendor_product_id}>Update Price</button>
        </div>
      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }

    if (results.data.success) {
      // alert("Product details");
    } else {
      alert(results.message);
    }
  } catch (error) {
    console.log(error);
  }
};

getProducts();

async function edit(btn) {
  console.log("View of product id ", btn.id);
  window.location.href = `/vendor/editProduct?vendorProductID=${btn.id}`;
}

async function editStock(btn) {
  console.log("stock button id", btn.id);
  document.getElementById("popup").style.display = "block";
  document.getElementById("stockSubmitID").onclick = async function () {
    let inputValue = document.getElementById("stockInput").value;
    await submitStock(btn.id, inputValue);
  };
}

async function updatePrice(btn) {
  console.log("price button id", btn.id);
  document.getElementById("updatePricePopup").style.display = "block";
  document.getElementById("priceSubmitID").onclick = async function () {
    let inputValue = document.getElementById("priceInput").value;
    await submitPrice(btn.id, inputValue);
  };
}

function closePopUp() {
  document.getElementById("popup").style.display = "none";
}

function closePricePopUp() {
  document.getElementById("updatePricePopup").style.display = "none";
}
async function submitStock(VendorProductID, inputValue) {
  const url = "/vendor/editStock";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        VendorProductID: VendorProductID,
        inputValue: inputValue,
      }),
    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    if (results.data.success) {
      document.getElementById("stockInput").value = "";
      getProducts();
      alert("Added successfully");
      document.getElementById("popup").style.display = "none";
    }
    getFirstNineProducts();
  } catch (error) {
    console.log(error);
  }
}

async function submitPrice(VendorProductID, inputValue) {
  console.log("submit button id of update price popup", VendorProductID);

  const url = "/vendor/updatePrice";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        VendorProductID: VendorProductID,
        inputValue: inputValue,
      }),
    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    if (results.data.success) {
      document.getElementById("priceInput").value = "";
      getProducts();
      alert("Price updated successfully");
      document.getElementById("updatePricePopup").style.display = "none";
      getFirstNineProducts();
    }

    console.log(results);
  } catch (error) {
    console.log(error);
  }
}

async function searchProduct() {
  document.getElementById("paginationButtons").style.display = "none";
  let searchValue = document.getElementById("searchInput").value;

  console.log(searchValue);
  const url = `/vendor/getSearchedProduct?SearchValue=${searchValue}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const results = await response.json();

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }
    console.log("All products search result", results);
    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.showSearchProductsResult.length);

    let str = "";

    for (let i = 0; i < results.data.showSearchProductsResult.length; i++) {
      let imagesArray =
        results.data.showSearchProductsResult[i].image_path.split(",");
      str += `<div class="ProductDiv" >

    
   <img class="imgid" src="${imagesArray[0]}">

  <div class="listProductsDetails">
    
    
    <h4>${results.data.showSearchProductsResult[i].product_name}</h4>
    <div class="otherDetail">
    <p> Available stock : ${results.data.showSearchProductsResult[i].available_stock}</p>
    <p> Stock : ${results.data.showSearchProductsResult[i].stock}</p>
    <p> Size : ${results.data.showSearchProductsResult[i].size}</p>
    <p> Color : ${results.data.showSearchProductsResult[i].color}</p>
    <p> Price : ${results.data.showSearchProductsResult[i].price}</p>
    <i onclick="edit(this)" id=${results.data.showSearchProductsResult[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.showSearchProductsResult[i].vendor_product_id} class="fa-solid fa-trash"></i>
    <button class="editStockButton" onclick="editStock(this)" id=${results.data.showSearchProductsResult[i].vendor_product_id}>Add stock</button>
    <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.showSearchProductsResult[i].vendor_product_id}>Update Price</button>
      </div>
 
    </div>
      
    </div>`;
    }
    mainProductDiv.innerHTML = str;
    if (searchValue == "") {
      document.getElementById("paginationButtons").style.display = "block";
      console.log("i m here ");
      getFirstNineProducts();
    }

    if (results.data.success) {
      // alert("Product details");
    } else {
      alert(results.message);
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(btn) {
  let confirmValue = confirm("do you want to delete this product ?");
  console.log(confirmValue);
  if (confirmValue) {
    let deletebtnID = btn.id;
    console.log("ID OF DELETE BUTTON", deletebtnID);

    const url = `/vendor/deleteProduct?deleteId=${deletebtnID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const results = await response.json();

      if (!results.data.success) {
        alert(results.message);
        window.location.href = "/auth/vendor-login";
      } else {
        console.log("in else");
        await getProducts();
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return;
  }
}

async function getFirstNineProducts() {
  const url = "/vendor/getFirstNineProducts";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const results = await response.json();
    console.log("result of first nine products is ", results);
    Last_page = results.data.total_pages;

    document.getElementById("current_page_id").innerText =
      results.data.current_page;
    document.getElementById("total_pages_id").innerText =
      results.data.total_pages;

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }

    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.getFirstNineProducts.length);
    if (results.data.getFirstNineProducts.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.getFirstNineProducts.length; i++) {
        let imagesArray =
          results.data.getFirstNineProducts[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.getFirstNineProducts[i].product_name}</h4>
      <div class="otherDetail">
      <p> Available stock : ${results.data.getFirstNineProducts[i].available_stock}</p>
      <p> Stock : ${results.data.getFirstNineProducts[i].stock}</p>
      <p> Size : ${results.data.getFirstNineProducts[i].size}</p>
      <p> Color : ${results.data.getFirstNineProducts[i].color}</p>
      <p> Price : ${results.data.getFirstNineProducts[i].price}</p>
      <i onclick="edit(this)" id=${results.data.getFirstNineProducts[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.getFirstNineProducts[i].vendor_product_id} class="fa-solid fa-trash"></i>
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.getFirstNineProducts[i].vendor_product_id}>Add stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.getFirstNineProducts[i].vendor_product_id}>Update Price</button>
        </div>

      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }
  } catch (error) {
    console.error(error.message);
  }
}

getFirstNineProducts();

async function first_page_handler() {
  const url = "/vendor/getRemainingProducts";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ First_Page: 0 }),
    });

    const results = await response.json();
    console.log("result of remaining products are ", results);

    document.getElementById("current_page_id").innerText =
      results.data.current_page;
    document.getElementById("total_pages_id").innerText =
      results.data.total_pages;

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }

    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.getRemainingProducts.length);
    if (results.data.getRemainingProducts.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.getRemainingProducts.length; i++) {
        let imagesArray =
          results.data.getRemainingProducts[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.getRemainingProducts[i].product_name}</h4>
      <div class="otherDetail">
      <p> Available stock : ${results.data.getRemainingProducts[i].available_stock}</p>
      <p> Stock : ${results.data.getRemainingProducts[i].stock}</p>
      <p> Size : ${results.data.getRemainingProducts[i].size}</p>
      <p> Color : ${results.data.getRemainingProducts[i].color}</p>
      <p> Price : ${results.data.getRemainingProducts[i].price}</p>
      <i onclick="edit(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-trash"></i>
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Add stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Update Price</button>
        </div>

      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }
  } catch (error) {
    console.log(error);
  }
}

async function prev_page_handler() {
  const url = "/vendor/getRemainingProducts";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Previous_page: 0 }),
    });

    const results = await response.json();
    console.log("result of remaining products are ", results);

    document.getElementById("current_page_id").innerText =
      results.data.current_page;
    document.getElementById("total_pages_id").innerText =
      results.data.total_pages;

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }

    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.getRemainingProducts.length);
    if (results.data.getRemainingProducts.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.getRemainingProducts.length; i++) {
        let imagesArray =
          results.data.getRemainingProducts[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.getRemainingProducts[i].product_name}</h4>
      <div class="otherDetail">
      <p> Available stock : ${results.data.getRemainingProducts[i].available_stock}</p>
      <p> Stock : ${results.data.getRemainingProducts[i].stock}</p>
      <p> Size : ${results.data.getRemainingProducts[i].size}</p>
      <p> Color : ${results.data.getRemainingProducts[i].color}</p>
      <p> Price : ${results.data.getRemainingProducts[i].price}</p>
      <i onclick="edit(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-trash"></i>
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Add stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Update Price</button>
        </div>

      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }
  } catch (error) {
    console.log(error);
  }
}

async function next_page_handler() {
  const url = "/vendor/getRemainingProducts";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Next_page: 0 }),
    });

    const results = await response.json();
    console.log("result of remaining products are ", results);

    document.getElementById("current_page_id").innerText =
      results.data.current_page;
    document.getElementById("total_pages_id").innerText =
      results.data.total_pages;

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }

    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.getRemainingProducts.length);
    if (results.data.getRemainingProducts.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.getRemainingProducts.length; i++) {
        let imagesArray =
          results.data.getRemainingProducts[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.getRemainingProducts[i].product_name}</h4>
      <div class="otherDetail">
      <p> Available stock : ${results.data.getRemainingProducts[i].available_stock}</p>
      <p> Stock : ${results.data.getRemainingProducts[i].stock}</p>
      <p> Size : ${results.data.getRemainingProducts[i].size}</p>
      <p> Color : ${results.data.getRemainingProducts[i].color}</p>
      <p> Price : ${results.data.getRemainingProducts[i].price}</p>
      <i onclick="edit(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-trash"></i>
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Add stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Update Price</button>
        </div>

      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }
  } catch (error) {
    console.log(error);
  }
}

async function last_page_handler() {
  const url = "/vendor/getRemainingProducts";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Last_page: 0 }),
    });

    const results = await response.json();
    console.log("result of remaining products are ", results);

    document.getElementById("current_page_id").innerText =
      results.data.current_page;
    document.getElementById("total_pages_id").innerText =
      results.data.total_pages;

    if (!results.data.success) {
      alert(results.message);
      window.location.href = "/auth/vendor-login";
    }

    let mainProductDiv = document.getElementById("listProducts");
    console.log(results.data.getRemainingProducts.length);
    if (results.data.getRemainingProducts.length == 0) {
      mainProductDiv.innerHTML = `<div id="noProducts">No Products added <div/>`;
      document.getElementById("");
    } else {
      let str = "";

      for (let i = 0; i < results.data.getRemainingProducts.length; i++) {
        let imagesArray =
          results.data.getRemainingProducts[i].image_path.split(",");
        str += `<div class="ProductDiv" >


      <img class="imgid" src="${imagesArray[0]}">

      <div class="listProductsDetails">

      <h4>${results.data.getRemainingProducts[i].product_name}</h4>
      <div class="otherDetail">
      <p> Available stock : ${results.data.getRemainingProducts[i].available_stock}</p>
      <p> Stock : ${results.data.getRemainingProducts[i].stock}</p>
      <p> Size : ${results.data.getRemainingProducts[i].size}</p>
      <p> Color : ${results.data.getRemainingProducts[i].color}</p>
      <p> Price : ${results.data.getRemainingProducts[i].price}</p>
      <i onclick="edit(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-pen editBtn"></i>  <i onclick="deleteProduct(this)" id=${results.data.getRemainingProducts[i].vendor_product_id} class="fa-solid fa-trash"></i>
      <button class="editStockButton" onclick="editStock(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Add stock</button>
      <button class="updatePriceButton" onclick="updatePrice(this)" id=${results.data.getRemainingProducts[i].vendor_product_id}>Update Price</button>
        </div>

      </div>
        
      </div>`;
      }
      mainProductDiv.innerHTML = str;
    }
  } catch (error) {
    console.log(error);
  }
}
