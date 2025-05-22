document.getElementById("header_search").style.display = 'none';

  let itemDiv = document.getElementsByClassName('items')[0];

  let page = 1;
  let itemPerPage = 8;

  getData();

  async function getData() {

    // Get product id from the URL
    const searchParams = new URLSearchParams(window.location.search);

    let catId = searchParams.get('id');

    let response = await fetch(`/getCategoryProducts?id=${catId}`);

    let result = await response.json();

    if (result.data === false) {
      window.location.href = '/noProduct'
    }

    document.getElementById("increasebtn").addEventListener("click", () => {
      disData(result.data, 1);
    });
    document.getElementById("decreasebtn").addEventListener("click", () => {
      disData(result.data, -1);
    });
    document.getElementById("firstbtn").addEventListener("click", () => {
      disData(result.data, "first");
    });
    document.getElementById("lastbtn").addEventListener("click", () => {
      disData(result.data, "last");
    });
    disData(result.data, 0);
  }

  async function disData(data, pv) {

    itemDiv.innerHTML = '';
    document.getElementById("increasebtn").style.display = 'inline-block';
    document.getElementById("lastbtn").style.display = 'inline-block';
    document.getElementById("firstbtn").style.display = 'inline-block';
    document.getElementById("decreasebtn").style.display = 'inline-block';

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemPerPage);


    if (pv == "first") {
      page = 1;
    } else if (pv == "last") {
      page = totalPages;
    } else {
      page += pv;
    }

    if (page >= totalPages) {
      page = totalPages
      document.getElementById("increasebtn").style.display = 'none';
      document.getElementById("lastbtn").style.display = 'none';
    } else {
      page = page;
    }

    if (page <= 1) {
      page = 1
      document.getElementById("firstbtn").style.display = 'none';
      document.getElementById("decreasebtn").style.display = 'none';
    } else {
      page = page;
    }

    document.getElementById("pageNumber").innerText = page;


    const startIndex = (page - 1) * itemPerPage;
    const endIndex = Math.min(startIndex + itemPerPage, totalItems);

    const itemsToDisplay = data.slice(startIndex, endIndex);

    itemsToDisplay.forEach(element => {

      // Getting first images from the array
      let imageArr = element.image_path.split(',');

      // Generating canceled price 
      let price = element.price;

      let html = `<div class="select-item">
                                        <img src="${imageArr[0]}" alt="${element.product_name}" id='${element.vendor_product_id}' class='select-product'>
                                        <p>${element.product_name}</p>
                                        <div class="price-detail">
                                            <p class='price'>&#8377;${element.offer_price}</p>
                                            <p class='original-price'>&#8377;${element.price}</p>
                                            <img src="/images/user_homepage_image/addToCart.png" alt="Add to cart" title='Add to cart' class='addToCart' id='cart-${element.vendor_product_id}-${element.category_id}'>
                                            <img src="/images/user_homepage_image/wishlist.png" alt="Wishlist" title='Wishlist' class='wishlist' id='wishlist-${element.vendor_product_id}'>                                         
                                        </div>
                                    </div>`;

      // Populate data on the webpage
      itemDiv.innerHTML += html;
    });

    let productInWishlist = await getWishlistData();
    if (productInWishlist != false) {
      await disWishlistData(productInWishlist);
    }

    //Get all the products and apply event listner on each product
    document.querySelectorAll('.select-product').forEach(product => {
      product.addEventListener('click', (e) => {
        e.preventDefault();
        let productId = e.target.id;

        window.location.href = `/single-product-detail?id=${productId}`;
      })
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
    // List of product in wishlist
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

    let allWishlistButton = document.querySelectorAll('.wishlist');

    allWishlistButton.forEach((btn) => {
      let id = btn.id.split('-')[1];

      btn.setAttribute("src", "/images/user_homepage_image/wishlist.png");

      data.forEach((product) => {
        let vendorProductId = product.vendor_product_id;

        if (+id === vendorProductId) {
          btn.setAttribute(
            "src",
            "/images/user_homepage_image/filledHeart.jpg"
          );
        }
      });
    });
  }