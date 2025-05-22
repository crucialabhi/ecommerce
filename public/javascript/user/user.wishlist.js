async function checkUserLogin() {
    let response = await fetch('/checkUserLogin', {
      method: "POST"
    });

    if (response.status != 200) {
      window.location.href = '/auth/login';
    }
  }
  checkUserLogin();

  document.getElementById("header_search").style.display = 'none';

  function goToSingleProductPage(vendor_product_id){
  window.location.href = `/single-product-detail?id=${+vendor_product_id}`
}
  async function runScript() {
    let wishlistArray = await fetchWishlistData();
    const cartElement = document.getElementById("cart");

    if (wishlistArray.length === 0) {
      document.getElementById("cart").innerHTML = `
                                                  <img src="/images/user_homepage_image/empty-cart.png" alt="" id='empty-img'>
                                                  <h3 align='center'>Your wishlist is empty</h3>
                                                  <button onclick="window.location.href='/shop'" id='shopnow' >Start shopping</button>`;
    } else {
      wishlistArray.forEach((item) => {
        const cartRow = document.createElement("div");
        cartRow.classList.add("cart-row");
        cartElement.innerHTML += `<hr id='hr-${item.wishlist_id}'>`;
        cartRow.innerHTML = `
          <div class="image" onclick="goToSingleProductPage(${item.
              vendor_product_id})"><img src="${
            item.image_path.split(",")[0]
          }" alt="Item"></div>
          <div class="item-name"><p>${item.product_name}</p></div>
          <div class="price">&#8377; ${+item.offer_price}</div>
          <div class="remove"><button onclick="removeWishlistBtn(${
            item.wishlist_id
          })">Remove</button></div>
          <div class="addToCart"><button onclick="addToCart(${
            item.vendor_product_id
          } , ${item.category_id})">Add to cart</button></div>
        `;
        cartElement.appendChild(cartRow);
      });
    }
  }

  async function removeWishlistBtn(itemId) {

    let res = await fetch("/removeWishlistItemApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemId,
      }),
    });
    let result = await res.json();
    setWishlistCount();
    const cartElement = document.getElementById("cart");
    const cartRows = cartElement.getElementsByClassName("cart-row");
    for (let i = 0; i < cartRows.length; i++) {
      if (
        cartRows[i].innerHTML.includes(`onclick="removeWishlistBtn(${itemId})"`)
      ) {
        cartElement.removeChild(cartRows[i]);
        document.getElementById(`hr-${itemId}`).style.display = "none";
        if (i === cartRows.length) {
          cartElement.innerHTML = ''
          await runScript();
        }
        break;
      }
    }
  }

  async function addToCart(vendorProductId, categoryId) {
    let response = await fetch("/addInCart", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        vendorProductId: vendorProductId,
        categoryId: categoryId,
      }),
    });
    let result = await response.json();


    if (result.data === true) {
      setCartCount();
      Swal.fire({
        position: "top-end",
        icon: "success",
        iconColor: 'hsl(176, 88%, 27%)',
        title: "Product added to cart",
        showConfirmButton: false,
        timer: 500,
        customClass: {
          popup: "custom-alert",
        },
      });
    }
  }

  async function fetchWishlistData() {
    let res = await fetch("/fetchWishlistData");
    let result = await res.json();
    return result.data;
  }
  runScript();
