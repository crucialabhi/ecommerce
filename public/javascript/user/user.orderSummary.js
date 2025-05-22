document.getElementById("header_search").style.display = 'none';

let address_div = document.getElementById("address");
let display_product = document.getElementById("display_product");
let order_summary = document.getElementById("order_summary");
let product_price = document.getElementById("product_price");
let quantity = document.getElementById("quantity");
let cart_subtotal = document.getElementById("cart_subtotal");
let total = document.getElementById("total");
let addressOfUser = [];
let selectedProduct = [];

const searchParams = new URLSearchParams(window.location.search);
let product_id = searchParams.get("productId");
async function runScript() {
  async function getAddressData() {
    let response = await fetch("/fetchAdresssForCheckout");
    let result = await response.json();
    return result;
  }

  async function getProductData() {
    let response = await fetch("/postOrderSummary", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: +product_id,
      }),
    });
    let result = await response.json();
    return result;
  }

  let product_details = await getProductData();
  selectedProduct = product_details;

  let review_ratings_arr = [];
  product_details.data.reviewData.forEach((e) => {
    review_ratings_arr.push(+e.review_rating);
  });
  let avgReview;

  if (review_ratings_arr.length != 0) {
    avgReview =
      review_ratings_arr.reduce((avg, value) => {
        return avg + value;
      }) / +product_details.data.reviewData.length;
  } else {
    avgReview = 0;
  }

  printProductData(product_details);
  const orderQuantity = localStorage.getItem("orderQuantity") || 1;
  const offerPrice = product_details.data.product[0].offer_price;

  cart_subtotal.innerHTML = `&#8377;${(offerPrice * orderQuantity).toFixed(2)}`;
  product_price.innerHTML = `&#8377;${offerPrice.toFixed(2)}`;

  quantity.innerText = `${localStorage.getItem("orderQuantity") || 1}`;

  total.innerHTML = `&#8377;${((offerPrice * orderQuantity) + 50).toFixed(2)}`;

  function printAddressData(addressData) {

    address_div.innerHTML += `
        <div class="change_address">
          <p>Deliver To:</p>
          <button>Change Address</button>
        </div>
        <div class="address_details">
          <p id="user_name">${addressData.data[0].first_name + " " + addressData.data[0].last_name
      } </p>
          <p id="address_detail">${addressData.data[0].address + " " + addressData.data[0].pin_code
      }</p>
          <p id="mobile_number">${addressData.data[0].mobile_number}</p>
        </div>
      `;
  }

  function printProductData(productData) {
    let starHtml = '';
    let exceptionHtml = '';

    for (let i = 0; i < parseInt(avgReview); i++) {
      starHtml += '<span class="fa fa-star checked"></span>';
    }
    for (let i = 0; i < 5 - parseInt(avgReview); i++) {
      starHtml += '<span class="fa fa-star"></span>';
    }

    exceptionHtml = `${avgReview.toFixed(1)} out of 5 Based on ${productData.data.reviewData.length} customers`
    if (avgReview === 0) {
      starHtml = '';
      exceptionHtml = 'No reviews for this product'
    }

    display_product.innerHTML = `
        <div class="img_quantity">
          <img src="${productData.data.product[0].image_path.split(",")[0]}" alt="" id="product_image" class="product_image">
          <input type="number" id='product_quantity' placeholder='Enter quantity..' onfocusout="calculateSubtotal(this)" value=${localStorage.getItem("orderQuantity") || 1} min=1 onchange="changeTotals(this)">
          <div id="quantityMsg" class=''></div>
        </div>

        <div class="product_description">
          <p id="product_name">${productData.data.product[0].product_name}</p>
          <p id="product_desc">${productData.data.product[0].description}</p>

          <div class="discount_price">
            <p id="product_price">&#8377;${productData.data.product[0].offer_price.toFixed(2)}</p>
          </div>

          <div class="review_details">
            <h3>Customer reviews</h3>
            <div class="stars">${starHtml}</div>
            <p>${exceptionHtml}</p>
          </div>
        </div>
      `;
  }
}
runScript();

async function calculateSubtotal(e) {
  let response = await quantityCheck();
  let result = await response.json();

  if (response.status == 202) {
    let data = result.data;
    let final_msg = data[0].split('##')[2].trim();

    document.getElementById("quantityMsg").innerHTML = final_msg;
    document.getElementById("quantityMsg").setAttribute('class', 'quantityMsg');
  } else if (response.status == 200) {
    localStorage.setItem("orderQuantity", +e.value);
    quantity.innerHTML = +e.value;

    const orderQuantity = Number(localStorage.getItem("orderQuantity") || 1);
    const offerPrice = Number(selectedProduct.data.product[0].offer_price);

    cart_subtotal.innerHTML = `&#8377;${(offerPrice * orderQuantity).toFixed(2)}`;
    total.innerHTML = `&#8377;${(offerPrice * orderQuantity + 50).toFixed(2)}`;
  } else {
    alert(result.message);
  }
}

async function changeTotals(e) {
  quantity.innerHTML = +e.value;

  const orderQuantity = +quantity.innerHTML;
  const offerPrice = Number(selectedProduct.data.product[0].offer_price);

  cart_subtotal.innerHTML = `&#8377;${(offerPrice * orderQuantity).toFixed(2)}`;
  total.innerHTML = `&#8377;${(offerPrice * orderQuantity + 50).toFixed(2)}`;
}

document.getElementById("checkoutbtn").addEventListener("click", async () => {
  let response = await quantityCheck();
  let result = await response.json();

  if (response.status == 202) {
    let data = result.data;
    let final_msg = data[0].split('##')[2].trim();

    let quantityMsgDiv = document.getElementById("quantityMsg").innerHTML = final_msg;
    document.getElementById("quantityMsg").setAttribute('class', 'quantityMsg');
  } else if (response.status == 200) {
    document.getElementById("quantityMsg").innerHTML = '';
    selectedProduct.data.product[0]["quantity"] = localStorage.getItem("orderQuantity") || 1;
    selectedProduct.data.product[0]["subtotal"] = +cart_subtotal.innerHTML.slice(1, cart_subtotal.innerHTML.length);
    let itemsToSendCheckout = [selectedProduct.data.product[0]];

    localStorage.setItem("buyingItem", JSON.stringify(itemsToSendCheckout));
    window.location.href = "/checkout";
  } else {
    alert(result.message)
  }
});

async function quantityCheck() {
  let response = await fetch("/beforeCheckoutPageQuantityCheckApi", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify([{
      quantity: +document.getElementById('product_quantity').value,
      venderProductId: selectedProduct.data.product[0].vendor_product_id,
    },]),
  });

  return response;
}