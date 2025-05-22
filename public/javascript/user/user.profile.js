document.getElementById("profile_nav_link").style.color = "#0d9488";
  document.getElementById("header_search").style.display = "none";

  getAllData();
  let previousDiv = "dashboard";
  let lastElement = document.getElementById("Dashboard");

  function checkDiv(currentDiv, currentElement) {
    if (currentDiv == "dashboard") {
      document.getElementById("name").innerHTML = `My Dashboard`;
    } else if (currentDiv == "address") {
      document.getElementById("name").innerHTML = `My Addresses`;
    } else if (currentDiv == "order") {
      document.getElementById("name").innerHTML = `My Orders`;
    } else if (currentDiv == "profile") {
      document.getElementById("name").innerHTML = "My Profile";
    } else if (currentDiv == "password") {
      document.getElementById("name").innerHTML = "Change Password";
    }

    lastElement.classList.remove("onthecomponent");
    currentElement.classList.add("onthecomponent");
    if (currentDiv == "address") {
      document.getElementById(previousDiv).style.display = "none";
      document.getElementById(currentDiv).style.display = "block";
      document.getElementById("addAddressButton").style.display = "block";
    } else {
      document.getElementById(previousDiv).style.display = "none";
      document.getElementById(currentDiv).style.display = "block";
      document.getElementById("addAddressButton").style.display = "none";
    }
    lastElement = currentElement;
    previousDiv = currentDiv;
  }

  function checkInnerDiv(currentDiv) {
    document.getElementById(previousDiv).style.display = "none";
    document.getElementById(currentDiv).style.display = "block";
    document.getElementById("addAddressButton").style.display = "none";
    previousDiv = currentDiv;
  }

  document
    .getElementById("addAddressForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = document.getElementById("addAddressForm");
      const formData = new FormData(form);

      let response = await fetch("/addNewAddressFromCheckout", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();
      if (!response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
        await getAllData();
        checkDiv("dashboard", document.getElementById("Dashboard"));
      }
    });

  async function getAllData() {
    const response = await fetch("/dashboard", {
      method: "post",
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.message);
      location.replace("/auth/login");
    } else {
      const userDetail = result.data.userDetails;
      const userAdddress = result.data.userAddress;
      const userOrder = result.data.userOrder;
      const productDetails = result.data.productDetails;
      await createProfile(userDetail);
      await editProfile(userDetail);
      await createAddress(userAdddress);
      await createOrders(userOrder, productDetails);
    }
  }

  async function createAddress(userAddressList) {
    let addressDiv = "";
    userAddressList.forEach((address) => {
      addressDiv += `<div class="address-main-div">
    <div class="address-div">
        <p>Address : ${address.address}</p>
        <p>Pin Code : ${address.pin_code}</p>
        <p>City : ${address.city}</p>
        <p>State : ${address.state}</p>
      </div>
      <div class="address-btn">
        <button class="btn" onclick = "editAddress('${address.address_id}','${address.address}','${address.pin_code}','${address.city}','${address.state}')">Edit Address</button>
      </div>
      </div>`;
      document.getElementById("address").innerHTML = addressDiv;
    });
  }

  async function editAddress(address_id, address, pin_code, city, state) {
    let addressForm = `
                    <form id="addressForm" onsubmit="" method='post'>
                        <div class="container">
                           <h3>Update Address</h3>
                        </div>
                     <div class="container">
                              <label for="address">Enter Address : </label>

                              <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value=${address}
                              />
                      </div>
                      <div class="container">
                            <label for="pinCode">Enter PinCode : </label>

                              <input
                                type="text"
                                name="pin_code"
                                placeholder="Pincode"
                              value=${pin_code}
                              />
                      </div>
                      <div class="container">
                            <label for="city">Enter City : </label>
                        
                              <input
                                type="text"
                                name="city"
                                placeholder="City"
                             value=${city}
                              />
                      </div>
                      <div class="container">
                              <label for="state">Enter State : </label> 
                              <input
                                type="text"
                                name="state"
                                placeholder="State"
                               value=${state}
                              />
                      </div>
                <div class="  container-center">
                  <input type="submit" value="Submit" class='btn' id='editAddressBtn'>
                  <div id="button-div2">
                      <button class ="backbtn" type="button" onclick="goBack()">Back</button>
                      <button class ="backbtn" type="button" onclick="deleteAddress(${address_id})">Delete</button> 
                  </div>
                </div>
          </form>
        `;
    document.getElementById("editAddressForm").innerHTML = addressForm;
    checkInnerDiv("editAddressForm");

    document
      .getElementById("addressForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = document.getElementById("addressForm");
        const formData = new FormData(form);
        formData.append("addressId", address_id);

        let response = await fetch("/update-address", {
          method: "POST",
          body: formData,
        });
        let result = await response.json();

        if (!response.ok) {
          alert(result.message);
        } else {
          alert(result.message);
          checkDiv("dashboard", document.getElementById("Dashboard"));
          await getAllData();
        }
      });
  }

  async function createOrders(userOrder, productDetails) {
    let createDiv = "";
    let i = 1;
    for (const obj of productDetails) {
      createDiv = ` 
       <div class="order-details">
        <div class="order-image">
          <img src="${obj.image}" alt="">
        </div>
        <div class="order-content" id='order-content${obj.orderId}'>
          <p>Order Id:${obj.orderId}</p>
          <p>${ (obj.productName).length > 18 ? (obj.productName).slice(0,13) + "..." : obj.productName}</p>
        </div>
        <div> 
          <button onclick="singleOrderRedirect(${obj.orderId})" class="btn">View Order</button>
        </div>`;

      document.getElementById("order").innerHTML += createDiv;

      let orderContent = document.getElementById(`order-content${obj.orderId}`);
      if (obj.deliveryStatus == "vendorVerification") {
        orderContent.innerHTML += `<div class="vendor-verification-div" id="vendor-verification-div${i}">${obj.deliveryStatus}</div>`;
      } else if (obj.deliveryStatus == "pending") {
        orderContent.innerHTML += `<div class="pending-div" id="pending-div${i}">${obj.deliveryStatus}</div>`;
      } else if (obj.deliveryStatus == "complete") {
        orderContent.innerHTML += `<div class="complete-div" id="complete-div${i}">${obj.deliveryStatus}</div>`;
      } else if (obj.deliveryStatus == "Refund complete") {
        orderContent.innerHTML += `<div class="rejected-div" id="rejected-div${i}">${obj.deliveryStatus}</div>`;
      } else {
        orderContent.innerHTML += `<div class="refund-complete-div" id="refund-complete-div${i}">${obj.deliveryStatus}</div>`;
      }

      i = i + 1;
    }
  }

  async function createProfile(userDetail) {
    document.getElementById(
      "dashboard"
    ).innerHTML = `<div class="dashboard-profile"><p>Name: ${userDetail[0].first_name}  ${userDetail[0].last_name}</p>
    <p>Contact Number: ${userDetail[0].mobile_number}</p>
    <p>Email: ${userDetail[0].email}</p></div>`;
  }

  async function editProfile(userDetail) {
    document.getElementById("profile").innerHTML = `
      <form method="post" id="editProfileForm">
        <div class="container">
          <h3>Update Profile</h3>
        </div>
        <div class="container">
          <input type="text" name="first_name" value ="${userDetail[0].first_name}" placeholder="First Name" />
        </div>
        <div class="container">
          <input type="text" name="last_name" value ="${userDetail[0].last_name}" placeholder="Last Name" />
        </div>
        <div class="container">
          <input type="text" name="contact" value ="${userDetail[0].mobile_number}" placeholder="Contact No" />
        </div>
        <div class="container-center">
          <input type="submit" value="Submit" id="profileSubmit">
        </div>
      </form>`;

    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = document.getElementById("editProfileForm");
        const formData = new FormData(form);
        const response = await fetch("/update-user-detail", {
          method: "post",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) {
          alert(result.message);
        } else {
          alert(result.message);
          await getAllData();
          checkDiv("dashboard", document.getElementById("Dashboard"));
        }
      });
  }

  // async function submitBtn(e) {
  //   e.preventDefault()
  //   const form = document.getElementById('form')
  //   const formData = new FormData(form)
  //   const response = await fetch('/update-user-detail', {
  //     method: 'post',
  //     body: formData
  //   })
  //   const result = await response.json()
  //   if (!response.ok) {
  //     alert(result.message)
  //   } else {
  //     alert(result.message)
  //     await getAllData()
  //     checkDiv('dashboard', document.getElementById('Dashboard'))
  //   }
  // }

  async function resetPassword(e) {
    e.preventDefault();
    const form = document.getElementById("resetform");
    const formData = new FormData(form);
    const response = await fetch("/update-user-password", {
      method: "post",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.message);
    } else {
      alert(result.message);
      form.reset();
      checkDiv("dashboard", document.getElementById("Dashboard"));
    }
  }

  async function singleOrderRedirect(order_id) {
    localStorage.setItem("order_id", order_id);
    window.location.href = `/singleOrderRedirect`;
  }

  async function logout() {
    let response = confirm("Are you sure!!");
    if (response) {
      document.cookie =
        "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      location.replace("/auth/login");
    }
  }

  async function goBack() {
    checkDiv("dashboard", document.getElementById("Dashboard"));
    await getAllData();
  }

  async function deleteAddress(address_id) {
    let response = await fetch("/deleteAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_id: address_id
      }),
    });
    let result = await response.json();
    if (result.data == true) {
      alert("Address deleted successfully");
      checkDiv("dashboard", document.getElementById("Dashboard"));
    } else {
      alert("Failed to delete address");
      checkDiv("dashboard", document.getElementById("Dashboard"));
    }
  }