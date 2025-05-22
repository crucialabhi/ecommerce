  document.getElementById("header_search").style.display = 'none';

  function removeItemFun(id) {
    let buyingItemArray = JSON.parse(localStorage.getItem("buyingItem")) || [];
    buyingItemArray = buyingItemArray.filter((item) => item.cart_id != id);
    localStorage.setItem("buyingItem", JSON.stringify(buyingItemArray));
    runScript();
  }

  async function runScript() {
    let buyingItemArray = JSON.parse(localStorage.getItem("buyingItem")) || [];


    const cartElement = document.getElementById("cart");
    const totalElement = document.getElementById("total");
    const cart_subtotal = document.getElementById("cart_subtotal");

    let userAddresses = await fetchAddress();

    const paymentSelect = document.getElementById("payment-method");
    const cardDetails = document.getElementById("card-details");

    paymentSelect.addEventListener("change", function() {
      if (this.value === "card") {
        cardDetails.style.display = "block";
      } else {
        cardDetails.style.display = "none";
      }
    });
    // const paymentBtn = document.getElementById('payment-order-btn')
    // paymentBtn.addEventListener('click', async (e) => {
    //   e.preventDefault();
    //   const selectedRadio = document.querySelector(
    //     'input[name="address"]:checked'
    //   ).value;
    //   let selected_Address = [];

    //   let currAddress = userAddresses.find((e) => e.address_id == selectedRadio);
    //   let buyingItemArray =
    //     JSON.parse(localStorage.getItem("buyingItem")) || [];
    //   let billingDataofUser = {
    //     buyingItemArray,
    //     currAddress
    //   };

    //   let quantityAndVenderProductIdArray = [];
    //   buyingItemArray.forEach((item) => {
    //     quantityAndVenderProductIdArray.push({
    //       quantity: item.quantity,
    //       venderProductId: item.vendor_product_id,
    //     });
    //   });

    //   let response = await fetch("/payment-gateway", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(billingDataofUser),
    //   });
    //   let result = await response.json();
    //   if (!response.ok) {
    //     alert(result.message)
    //   } else {
    //     alert(result.message);
    //     // window.location.href = '/completePaymentPage';
    //     location.replace(result.data.url);
    //   }

    // })

    // function removeItemFun(id){

    //   // buyingItemArray = buyingItemArray.filter(item => item.user_id !== id);
    //   // localStorage.setItem('buyingItem', JSON.stringify(buyingItemArray));
    //   // updateUI();
    // }

    function updateTotal() {
      const total = buyingItemArray.reduce((acc, item) => {
        return acc + +item.subtotal;
      }, 0);

      cart_subtotal.textContent = `Rs ${total.toFixed(2)}`;
      totalElement.textContent = `Rs ${(+total + 50).toFixed(2)}`;
    }

    function updateUI() {
      if (buyingItemArray.length != 0) {
        cartElement.innerHTML = `
                <div class="cart-row">
                    <div class="image"><p>Image</p></div>
                    <div class="item-name"><p>Name</p></div>
                    <div class="price"><p>Price</p></div>
                    <div class="quantity"><p>Quantity</p></div>
                    <div class="subtotal"><p>Subtotal</p></div>
                    <div class="edit"><p></p></div>
                </div>
            `;


        buyingItemArray.forEach((item) => {
          const cartRow = document.createElement("div");
          cartRow.classList.add("cart-row");

          cartRow.innerHTML = `
                    <div class="image"><img src="${
                      item.image_path.split(",")[0]
                    }" alt="Item"></div>
                    <div class="item-name">${item.product_name}</div>
                    <div class="price">${item.offer_price.toFixed(2)}</div>
                    <div class="quantity">${item.quantity}</div>
                    <div class="subtotal">${(+item.subtotal).toFixed(2)}</div>
                    <div class="remove"><button class="itemremove" onclick="removeItemFun(${
                      item.cart_id
                    })">Remove</button></div>
                `;

          const subtotalElement = cartRow.querySelector(".subtotal");

          cartElement.appendChild(cartRow);
        });

        updateTotal();
      }
      // cartElement.innerHTML = '';
      else {
        document.getElementById("main_div").innerHTML = `<div class='noitems'><h1>There is nothing to checkout here</h1></div>`;
        setTimeout(() => {
          // window.location.href = '/';
        }, 2000);
      }
    }

    updateUI();

    let placeOrderBtn = document.getElementById("place-order-btn");
    placeOrderBtn.addEventListener("click", async () => {
      const selectedRadioInput = document.querySelector(
        'input[name="address"]:checked'
      );
      let selectedRadio;
      if (selectedRadioInput == null) {
        alert('Please select address');
        return
      } else {
        selectedRadio = selectedRadioInput.value;
      }

      let selected_Address = [];
      // address id upar thi aavtu nathi to pela query ma add karine aaavu
      // let allprintAddress = document.getElementsByName('address')


      let currAddress = userAddresses.find(
        (e) => e.address_id == selectedRadio
      );
      let buyingItemArray =
        JSON.parse(localStorage.getItem("buyingItem")) || [];
      let billingDataofUser = {
        buyingItemArray: buyingItemArray,
        currAddress
      };

      let quantityAndVenderProductIdArray = [];
      buyingItemArray.forEach((item) => {
        quantityAndVenderProductIdArray.push({
          quantity: item.quantity,
          venderProductId: item.vendor_product_id,
        });
      });

      let res1 = await fetch("/beforeCheckoutPageQuantityCheckApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quantityAndVenderProductIdArray),
      });
      let result = await res1.json();

      if (res1.status == 202) {
        // let msg = ''

        let data = result.data;

        let final_msg = [];
        for (let i = 0; i < data.length; i++) {
          let array = data[i].split("##");
          let id = array[1];
          let newarr = [...array];

          let currObj = buyingItemArray.find(
            (element) => element.vendor_product_id === +id
          );

          newarr[1] = currObj["product_name"];
          final_msg.push(newarr.join(" "));
        }
        let alert_msg = "";

        for (msg of final_msg) {
          alert_msg += msg + "\n";
        }

        let quantityMsgDiv = document.getElementById("quantityMsg");
        alert(alert_msg)
        // quantityMsgDiv.innerHTML = alert_msg;
        // alert(alert_msg)
      } else {
        // alert("success");
        let res = await fetch("/postPlaceOrderData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(billingDataofUser),
        });
        let data = await res.json();

        if (res.status == 200) {
          localStorage.removeItem("buyingItem");
          alert("Your Order has been placed successfully");
          window.location.href = "/thankyou";
        } else {
          alert("order not place");
        }
      }


    });

    populateGrid(userAddresses);
  }

  function closePopUp() {
    document.getElementById("popup").style.display = "none";
  }


  function addAddressFunction() {
    let html = `
          <div id="popup">
          <div class="popupdiv">
            <div class="bottom">
              <div class="container_div">
                <label for="address">Enter Address : </label>
                <input type="text" id="address" placeholder="Add Address" value="" required><br><br>
                <label for="pinCode">Enter Pin code : </label>
                <input type="text" id="pin_code" placeholder="Add pin code" value="" required><br><br>
                <label for="city">Enter City : </label>
                <input type="text" id="city" placeholder="Add city" value="" required><br><br>
                <label for="state">Enter State : </label>
                <input type="text" id="state" placeholder="Add state" value="" required><br><br>
              </div>
              <div class="container_center">
                <input id="stockSubmitID" class="submitBtn" type="button" value="Back" onclick="closePopUp()"> 
                <input id="stockSubmitID" class="submitBtn" type="button" value="Submit" onclick="submitAddress()">
              </div>
            </div>
          </div>
      `;
    document.getElementById("addNewAdd").innerHTML = html;
  }

  async function submitAddress() {
    let address = document.getElementById("address").value;
    let pin_code = document.getElementById("pin_code").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let data = {
      address: address,
      pin_code: pin_code,
      city: city,
      state: state,
    };

    let response = await fetch("/addNewAddressFromCheckout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let result = await response.json();
    if (result.data == true) {
      alert("Address Added Successfully");
      document.getElementById("popup").style.display = "none";

      let printAddress = await fetchAddress();
      populateGrid(printAddress);
      /////////////////////////////

      window.location.reload()


    } else if (result.status == 404) {
      alert("Error adding new address");
      document.getElementById("popup").style.display = "none";
    } else if (result.data == false || result.status == 410) {
      alert(result.message);
    }
  }

  runScript();

  async function fetchAddress() {
    let res = await fetch("/fetchAdresssForCheckout");

    let result = await res.json();
    return result.data;
  }

  async function populateGrid(totalAddress) {

    document.getElementById("grid-body").innerHTML = "";
    if (totalAddress.length > 0) {
      document.getElementById("grid-header").innerHTML = `
            <div class="grid-cell">Select</div>
            <div class="grid-cell">Address</div>
            <div class="grid-cell">Pin Code</div>
            <div class="grid-cell">City</div>
            <div class="grid-cell">State</div>
      `;

      const gridBody = document.getElementById("grid-body");

      totalAddress.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("grid-row");
        row.innerHTML = `
                    <div class="grid-cell">
                        <input type="radio"  name="address" value="${item.address_id}" class="radio-button">
                    </div>
                    <div class="grid-cell">${item.address}</div>
                    <div class="grid-cell">${item.pin_code}</div>
                    <div class="grid-cell">${item.city}</div>
                    <div class="grid-cell">${item.state}</div>
                `;
        gridBody.appendChild(row);
      });
    }
  }