document.getElementById("header_search").style.display = 'none';
  document.getElementById("home_nav_link").style.color = "#0d9488";

  let itemDiv = document.getElementsByClassName("items")[0];
  let categoryDiv = document.getElementById("categories");

  async function runScript() {
    document.getElementById("shop-now").addEventListener("click", () => {
      window.location.href = "/shop";
    });


    document
      .getElementById("featured")
      .addEventListener("click", async () => {
        let products = await getData("featured");
        disData(products.data);
      });

    document.getElementById("popular").addEventListener("click", async () => {
      let products = await getData("popular");
      disData(products.data);
    });
    document.getElementById("popular").addEventListener("click", async () => {
      let products = await getData("popular");
      disData(products.data);
    });

    document
      .getElementById("new-added")
      .addEventListener("click", async () => {
        let products = await getData("new-added");
        disData(products.data);
      });

    let products = await getData("new-added");
    disData(products.data);

    let categories = await getCategoryDetail();
    disCategoryData(categories.data);


    // let productsForSearch = await getData();
    // document.getElementById("search-items").addEventListener('keyup', async (e) => {
    //   window.location.href = '#shop-item';
    //   let searchResult = productsForSearch.data.filter((e1) => e1.searching_tags.toLowerCase().includes(e.target.value.toLowerCase()));
    //   if (searchResult.length) {
    //     disData(searchResult);
    //   } else {
    //     itemDiv.innerHTML = `<div class="no-results">No search results found. Please try a different keyword.</div>`;
    //   }
    // });
  }
  runScript();

  async function getCategoryDetail() {
    let response = await fetch("/getCategoryData");
    let result = await response.json();
    return result;
  }

  async function disCategoryData(data) {
   let imgString = "https://res.cloudinary.com/dozcrwtud/image/upload/v1743741933/ltle7ilsaeuh9fra96ah.jpg,https://res.cloudinary.com/dozcrwtud/image/upload/v1743742060/dfk748iy7kou2jvjcnrr.jpg,https://res.cloudinary.com/dozcrwtud/image/upload/v1743742128/qinlyqcneblyzzwfdgud.jpg,https://res.cloudinary.com/dozcrwtud/image/upload/v1743742063/xws7dct9s2pwa9fgwmsk.jpg";
    let imgArr = imgString.split(",");
    let i = 0;

    data.forEach((category) => {
      categoryDiv.innerHTML += `
        <div class="cat">
          <img src="${imgArr[i++]}" alt="${category.cat_name}" id="${category.cat_id}">
          <p>${category.cat_name}</p>
        </div>`;
    });

    document.querySelectorAll(".cat").forEach((category) => {
      category.addEventListener("click", async (e) => {
        e.preventDefault();
        let categoryId = e.target.id;
        window.location.href = `/shopByCategory?id=${categoryId}`;
      });
    });
  }

  // Function to display all featured products
  async function getData(type) {
    let response = await fetch("/getData", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        type: type,
      }),
    });

    let result = await response.json();
    return result;
  }

  async function disData(data) {
    itemDiv.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let imageArr = data[i].image_path.split(",");
      itemDiv.innerHTML += `
          <div class="select-item">
            <img src="${imageArr[0]}" alt="${data[i].product_name}" id='${data[i].vendor_product_id}' class='select-product'>
            <p>${data[i].product_name}</p>
            <div class="price-detail">
              <span class='product_price_span'>
                <p class='price'>&#8377;${data[i].offer_price}</p>
                <p class='original-price'>&#8377;${data[i].price}</p>
              </span>
              <img src="/images/user_homepage_image/addToCart.png" alt="" title='Add to cart' class='addToCart' id='cart-${data[i].vendor_product_id}-${data[i].category_id}'>
              <img src="/images/user_homepage_image/wishlist.png" alt="" title='Wishlist' class='wishlist' id='wishlist-${data[i].vendor_product_id}'>
            </div>
          </div>`;
    }


    let productInWishlist = await getWishlistData();
    if (productInWishlist != false) {
      await disWishlistData(productInWishlist);
    }

    document.querySelectorAll(".select-product").forEach((product) => {
      product.addEventListener("click", (e) => {
        e.preventDefault();
        let productId = e.target.id;

        window.location.href = `/single-product-detail?id=${productId}`;
      });
    });

    // Get all the buttons of add to cart
    document.querySelectorAll(".addToCart").forEach((product) => {
      product.addEventListener("click", async (e) => {
        e.preventDefault();

        // Check if the user is logged in        
        if (productInWishlist === false) {
          alert("Login to add product to cart");
        } else {
          let productId = e.target.id.split("-")[1];
          let categoryId = e.target.id.split("-")[2];

          let response = await fetch("/addInCart", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              vendorProductId: productId,
              categoryId: categoryId,
            }),
          });

          let result = await response.json();
          Swal.fire({
            position: "top-end",
            icon: "success",
            iconColor: 'hsl(176, 88%, 27%)',
            title: "Product added to cart",
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: "custom-alert",
            },
          });
          setCartCount();
        }
      });
    });

    document.querySelectorAll(".wishlist").forEach((product) => {
      product.addEventListener("click", async (e) => {
        e.preventDefault();
        if (productInWishlist === false) {
          alert("Login to add product to Wishlist");
        } else {
          let productId = e.target.id.split("-")[1];

          let response = await fetch("/addInWishlist", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              vendorProductId: productId,
            }),
          });

          let result = await response.json();
          if (result.data === true) {
            // Alert
            setWishlistCount()
            Swal.fire({
              position: "top-end",
              icon: "success",
              iconColor: 'hsl(176, 88%, 27%)',
              title: `${result.message}`,
              showConfirmButton: false,
              timer: 1000,
              customClass: {
                popup: "custom-alert",
              },
            });
          } else {
            let newWishlistDetails = await getWishlistData();

            let wishlistId;
            let productInWishlist = await getWishlistData();
            if (productInWishlist != false) {
              wishlistId = () => {
                for (let i = 0; i < newWishlistDetails.length; i++) {
                  if (productId == newWishlistDetails[i].vendor_product_id) {
                    return newWishlistDetails[i].wishlist_id;
                  }
                };
              }
            }
            let id = wishlistId();

            let removeApi = await fetch("/removeWishlistItemApi", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                id: id,
              }),
            });

            let removeAns = await removeApi.json();

            if (removeAns.data === true) {
              setWishlistCount();
              Swal.fire({
                position: "top-end",
                icon: "success",
              iconColor: 'hsl(176, 88%, 27%)',
                title: `Product removed from the wishlist`,
                showConfirmButton: false,
                timer: 1000,
                customClass: {
                  popup: "custom-alert",
                },
              });
            }
          }

          let productInWishlist = await getWishlistData();
          if (productInWishlist != false) {
            await disWishlistData(productInWishlist);
          }
        }
      });

    });

  }

  async function getWishlistData() {
    let wishlistProducts = await fetch("/productInWishlist", {
      method: 'post'
    });
    let wishlistProductsResult = await wishlistProducts.json();
    if (wishlistProductsResult.data == false) {
      return false;
    }
    return wishlistProductsResult.data.productsInWishlist;
  }

  async function disWishlistData(data) {
    let allWishlistButton = document.querySelectorAll(".wishlist");

    allWishlistButton.forEach((btn) => {
      let id = btn.id.split("-")[1];

      btn.setAttribute("src", "/images/user_homepage_image/wishlist.png");

      data.forEach((product) => {
        let vendorProductId = product.vendor_product_id;

        // Covert string to int for compare
        if (+id === vendorProductId) {
          btn.setAttribute(
            "src",
            "/images/user_homepage_image/filledHeart.jpg"
          );
        }
      });
    });

  }