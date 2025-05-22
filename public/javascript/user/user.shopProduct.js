document.getElementById("shop_nav_link").style.color = '#0d9488';
  let filteredProducts = [];
  let itemDiv = document.getElementsByClassName("items")[0];
  let categories_div = document.getElementById("categories-div");

  let page = 1;
  let itemPerPage = 8;

  async function disData(data, pv) {
    itemDiv.innerHTML = "";

    document.getElementById("increasebtn").style.display = "inline-block";
    document.getElementById("lastbtn").style.display = "inline-block";
    document.getElementById("firstbtn").style.display = "inline-block";
    document.getElementById("decreasebtn").style.display = "inline-block";

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
      page = totalPages;
      document.getElementById("increasebtn").style.display = "none";
      document.getElementById("lastbtn").style.display = "none";
    } else {
      page = page;
    }

    if (page <= 1) {
      page = 1;
      document.getElementById("firstbtn").style.display = "none";
      document.getElementById("decreasebtn").style.display = "none";
    } else {
      page = page;
    }

    document.getElementById("pageNumber").innerHTML = page;

    const startIndex = (page - 1) * itemPerPage;
    const endIndex = Math.min(startIndex + itemPerPage, totalItems);

    const itemsToDisplay = data.slice(startIndex, endIndex);

    itemsToDisplay.forEach((element) => {
      let imageArr = element.image_path.split(",");
      let price = element.price;

      // let wishlistIcon = "/images/user_homepage_image/wishlist.png";

      // for(let i=0;i<productInWishlist.length ;i++){
      //   if(element.vendor_product_id === productInWishlist[i].vendor_product_id){
      //     wishlistIcon='/images/user_homepage_image/filledHeart.jpg'
      //   }
      // }

      itemDiv.innerHTML += `
        <div class="select-item">
          <img src="${imageArr[0]}" alt="${element.product_name}" id='${element.vendor_product_id}' class='select-product'>
          <p>${element.product_name}</p>
          <div class="price-detail">
            <p class='price'>&#8377;${element.offer_price}</p>
            <p class='original-price'>&#8377;${element.price}</p>
            <img src="/images/user_homepage_image/addToCart.png" alt="" title='Add to cart' class='addToCart' id='cart-${element.vendor_product_id}-${element.category_id}'>
            <img src="/images/user_homepage_image/wishlist.png" alt="" title='Wishlist' class='wishlist' id='wishlist-${element.vendor_product_id}'>
          </div>
        </div>
      `;
    });

    let productInWishlist = await getWishlistData();
    if (productInWishlist != false) {
      await disWishlistData(productInWishlist);
    }

    //Get all the products and apply event listner on each product
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

  document.getElementById("increasebtn").addEventListener("click", () => {
    disData(filteredProducts, 1);
  });
  document.getElementById("decreasebtn").addEventListener("click", () => {
    disData(filteredProducts, -1);
  });
  document.getElementById("firstbtn").addEventListener("click", () => {
    disData(filteredProducts, "first");
  });
  document.getElementById("lastbtn").addEventListener("click", () => {
    disData(filteredProducts, "last");
  });

  async function runScript() {
    async function getData() {
      let response = await fetch("/getData", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          type: "",
        }),
      });
      let result = await response.json();
      return result;
    }

    let products = await getData();
    filteredProducts = products.data;

    disData(products.data, 0);

    let productsForSearch = await getData();
    document
      .getElementById("search-items")
      .addEventListener("keyup", async (e) => {
        let searchResult = productsForSearch.data.filter((e1) =>
          e1.searching_tags.toLowerCase().includes(e.target.value.toLowerCase())
        );
        if (searchResult.length) {
          disData(searchResult, 0);
          filteredProducts = searchResult;
        } else {
          itemDiv.innerHTML = `<div class="no-results">No search results found. Please try a different keyword.</div>`;
        }
      });
  }

  runScript();
  printCategories(0);

  async function getCategoryData(id) {
    let response = await fetch("/postCategoryData", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    let result = await response.json();
    return result;
  }

  async function printCategories(cat_id) {
    categories_div.innerHTML = ``;

    let categoryData = await getCategoryData(cat_id);

    categories_div.innerHTML += `
          <div class="categories-container">
              <h2 class="categories-title">Categories</h2>
              <div class="category-names">
      `;
    categoryData.data.forEach((e) => {
      if (!(e.cat_name == 'Jewellery' || e.cat_name == 'Books')) {
        categories_div.innerHTML += `
              <p class='category-link' onclick="goToSubCategory(${e.cat_id}, '${e.cat_name}')">${e.cat_name}</p>
          `;
      }
    });

    categories_div.innerHTML += `
              </div>
          </div>
      `;
  }

  let filterSequenceNames = [];
  let filterSequenceIds = [];
  let hierarchy = document.getElementById("hierarchy");
  hierarchy.innerHTML += `<li><a href="/shop" class="filter-link">All</a></li>`;

  async function goToSubCategory(id, cat_name) {
    let hierarchy = document.getElementById("hierarchy");

    async function getData() {
      let response = await fetch("/getData", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          type: "",
        }),
      });
      let result = await response.json();
      return result;
    }
    let productData = await getData();
    filteredProducts = productData.data;
    hierarchy.innerHTML = ``;
    let index = filterSequenceNames.indexOf(cat_name);

    if (index == -1) {
      filterSequenceIds.push(id);
      filterSequenceNames.push(cat_name);
    } else {
      filterSequenceIds.splice(index + 1);
      filterSequenceNames.splice(index + 1);
    }
    printCategorySequence(filterSequenceIds, filterSequenceNames);

    let searchResult = filteredProducts.filter((e1) =>
      e1.searching_tags.split(',').includes(cat_name)
    );
    if (searchResult.length) {
      disData(searchResult, 0);
      filteredProducts = searchResult;
    } else {
      itemDiv.innerHTML = `<div class="no-results">No search results found. Please try a different keyword.</div>`;
    }
    printCategories(id);
  }

  async function goToParentCategory(id, cat_name) {
    goToSubCategory(id, cat_name);
    let searchResult = filteredProducts.filter((e1) =>
      e1.searching_tags.toLowerCase().includes(cat_name.toLowerCase())
    );

    if (searchResult.length) {
      disData(searchResult, 0);
      filteredProducts = searchResult;
    } else {
      itemDiv.innerHTML = `<div class="no-results">No search results found. Please try a different keyword.</div>`;
    }
  }

  function printCategorySequence(ids, names) {
    hierarchy.innerHTML = ``;

    hierarchy.innerHTML += `<li><a href="/shop" class="filter-link">All</a></li>`;

    for (let i = 0; i < names.length; i++) {
      hierarchy.innerHTML += `
        <li><span class="filter-separator">></span></li>
        <li><p onclick="goToParentCategory(${ids[i]}, '${names[i]}')" class="filter-link">${names[i]}</p></li>
    `;
    }
  }