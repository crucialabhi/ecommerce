document.getElementById("header_search").style.display = "none";

function goToSingleProductPage(vendor_product_id) {
  window.location.href = `/single-product-detail?id=${+vendor_product_id}`;
}
async function runScript() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = '';
  async function fetchCartData() {
    let res = await fetch("/fetchCartData");

    let result = await res.json();
    let cartArray = result.data;
    return cartArray;
  }
  var cartDetails = await fetchCartData();
  for (let i = 0; i < cartDetails.length; i++) {
    cartDetails[i]["subtotal"] = +cartDetails[i]["offer_price"] * +cartDetails[i]["quantity"];
  }


  const totalElement = document.getElementById("total");

  const cart_subtotal = document.getElementById("cart_subtotal");

  let cartBuyBtn = document.getElementById("cartBuyBtn");

  function updateTotal() {
    let quantityMsgDiv = document.getElementById("quantityMsg");
    quantityMsgDiv.innerHTML = "";
    const total = cartDetails.reduce((acc, item) => {
      const checkbox = document.querySelector(
        `.buy_selected[value="${item.cart_id}"]`
      );

      if (checkbox && checkbox.checked) {
        return acc + +item.subtotal;
      }
      if (acc == 0) {
        document.getElementById("shipping_charge").innerHTML = "Rs 00";
      } else {
        document.getElementById("shipping_charge").innerHTML = "Rs 50";
      }
      return acc;
    }, 0);
    if (total == 0) {
      document.getElementById("shipping_charge").innerHTML = "Rs 00";
      totalElement.textContent = `Rs 00 `;
      cart_subtotal.textContent = `Rs 00`;
      cartBuyBtn.disabled = true;
      cartBuyBtn.innerHTML = "no items selected";
    } else {
      document.getElementById("shipping_charge").innerHTML = "Rs 50";
      cart_subtotal.textContent = `Rs ${total.toFixed(2)}`;
      totalElement.textContent = `Rs ${+total.toFixed(2) + 50} `;
      cartBuyBtn.disabled = false;
      cartBuyBtn.innerHTML = "Proceed to checkout";
    }
  }


  if (cartDetails.length === 0) {
    document.getElementById("cart").innerHTML = `
                                                  <img src="/images/user_homepage_image/empty-cart.png" alt="" id='empty-img'>
                                                  <h3 align='center'>Your cart is empty</h3>
                                                  <button onclick="window.location.href='/shop'" id='shopnow' >Start shopping</button>`;

    document.getElementById('order-total').style.display = 'none'
    // document.getElementById('quantityMsg').innerHTML=''
  } else {
    cartDetails.forEach((item) => {
      const cartRow = document.createElement("div");

      cartRow.classList.add("cart-row");
      cartRow.innerHTML = `
  
          <div class="image" onclick="goToSingleProductPage(${item.vendor_product_id
        })"><img src="${item.image_path.split(",")[0]}" alt="Item"></div>
  
          <div class="item-name-description"><p class="item-name-details">${item.product_name
        }</p></div>
  
          <div class="price">${item.offer_price.toFixed(2)} &#8377;</div>
  
          <div class="quantity"><input type="number" class="quantity-input" value="${item.quantity
        }" min="1"></div>
  
          <div class="subtotal">${item.subtotal.toFixed(2)}</div>
  
          <div class="edit"><input type="checkbox" class="buy_selected" value="${item.cart_id
        }" checked></div>
  
          <div class="remove"> <button type="button" class="cartRemoveBtn" onclick="removeItemFromCartFun(${item.cart_id
        })">Remove</button></div>
          
      `;

      const quantityInput = cartRow.querySelector(".quantity-input");

      const subtotalElement = cartRow.querySelector(".subtotal");

      const checkbox = cartRow.querySelector(".buy_selected");

      quantityInput.addEventListener("change", () => {
        const newQuantity = parseInt(quantityInput.value);

        if (newQuantity > 0) {
          item.quantity = newQuantity;

          item.subtotal = (item.offer_price * newQuantity).toFixed(2);

          subtotalElement.textContent = `${item.subtotal}`;

          updateTotal();
        }
      });

      checkbox.addEventListener("change", () => {
        updateTotal();
      });

      cartElement.appendChild(cartRow);
    });
    updateTotal();
  }


  cartBuyBtn.addEventListener("click", async () => {
    const buySelected = document.querySelectorAll(".buy_selected");

    const itemsToBuy = [];

    buySelected.forEach((checkbox) => {
      if (checkbox.checked) {
        const itemId = parseInt(checkbox.value);

        const selectedItem = cartDetails.find(
          (item) => item.cart_id === itemId
        );
        flag = true;
        if (selectedItem) {
          itemsToBuy.push({
            ...selectedItem,
          });
        }
      }
    });

    let quantityAndVenderProductIdArray = [];
    itemsToBuy.forEach((item) => {
      quantityAndVenderProductIdArray.push({
        quantity: item.quantity,
        venderProductId: item.vendor_product_id,
      });
    });

    let res = await fetch("/beforeCheckoutPageQuantityCheckApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quantityAndVenderProductIdArray),
    });
    let result = await res.json();
    if (res.status == 202) {
      let data = result.data;

      let final_msg = [];
      for (let i = 0; i < data.length; i++) {
        let array = data[i].split("##");
        let id = array[1];
        let newarr = [...array];

        let currObj = itemsToBuy.find(
          (element) => element.vendor_product_id === +id
        );

        newarr[1] = currObj["product_name"];
        final_msg.push(newarr.join(" "));
      }
      let alert_msg = "";

      for (msg of final_msg) {
        alert_msg += msg + "<br><br>";
      }

      let quantityMsgDiv = document.getElementById("quantityMsg");
      quantityMsgDiv.innerHTML = alert_msg;
    } else {
      localStorage.setItem("buyingItem", JSON.stringify(itemsToBuy));
      window.location.href = "/checkout";
    }

    /////////////////////////////////////////////////////////////////
    // check karva ke checkout ma qunatity ma stock alret no msg aave chhe ke ny
    // localStorage.setItem("buyingItem", JSON.stringify(itemsToBuy));
    // window.location.href = "/checkout";
    ///////////////////////////////////////////////////////////////////////
  });
}

async function removeItemFromCartFun(cart_id) {

  let res = await fetch("/removeItemFromCartApi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_id: cart_id,
    }),
  });

  let data = await res.json();
  if (res.status == 200) {
    setCartCount();
    runScript();
  }
}
runScript();