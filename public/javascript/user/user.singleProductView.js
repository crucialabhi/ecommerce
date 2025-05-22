document.getElementById("header_search").style.display = 'none';
  let headerProductName = document.getElementById("pname");

  let productName = document.getElementById("product-name");
  let price = document.getElementById("price");
  let removedPrice = document.getElementById("removed-price");
  let description = document.getElementById("description");
  let colorButton = document.getElementById("color");
  let sizeButton = document.getElementById("size");

  let listImageDiv = document.getElementById("image");
  let allImageDiv = document.getElementById("img-group");

  let addToCart = document.getElementById("cart");
  let wishlist = document.getElementById("wishlist");
  let buynow = document.getElementById("buynow");

  // For reviews
  let reviewDiv = document.getElementById("reviews");
  let userReviewButtonDiv = document.getElementById("can-review");

  // Fetch data for particular category id
  getData();

  async function getData() {
    // Get product id from the URL
    const searchParams = new URLSearchParams(window.location.search);
    let productId = searchParams.get("id");

    // Fetch API
    let response = await fetch(
      `/get-single-product-detail?id=${productId}`
    );
    let result = await response.json();

    disData(result.data, productId);
  }

  async function disData(data, productId) {


    // Assign values to every div
    headerProductName.innerText = data[0].product_name;
    productName.innerText = data[0].product_name;
    price.innerHTML = "&#8377;" + data[0].offer_price;

    description.innerHTML = data[0].description;
    colorButton.style.backgroundColor = data[0].color;
    sizeButton.innerText = data[0].size;
    removedPrice.innerHTML = '&#8377;' + data[0].price

    let imageArr = data[0].image_path.split(",");

    listImageDiv.innerHTML = `<img src="${imageArr[0]}" alt="Product image">`;

    imageArr.forEach((element) => {
      allImageDiv.innerHTML += `
                                <div class='images'>
                                    <img src="${element}" alt="Product image">
                                </div>`;
    });

    document.querySelectorAll(".images").forEach((img) => {
      img.addEventListener("click", (e) => {
        e.preventDefault();

        let imgPath = e.target.src;

        listImageDiv.innerHTML = `<img src="${imgPath}" alt="Product image">`;
      });
    });

    addToCart.addEventListener("click", async () => {
      let categoryId = data[0].category_id;

      let response = await fetch("/addInCart", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          vendorProductId: productId,
          categoryId: categoryId,
        }),
      });

      let result = await response.json();
      if (result.data === false) {
        alert("Login to add product to cart");
      } else {
        setCartCount();
        // Alert
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
      }
    });

    buynow.addEventListener('click', async () => {

      let response = await fetch('/checkUserLogin', {
        method: "post"
      });
      if (response.status == 200) {
        window.location.href = `/orderSummary?productId=${productId}`;
        localStorage.removeItem('orderQuantity')

      } else {
        alert('Please login to buy now')
      }
    })

    // Check for wishlist data
    getWishlistData(productId);
  }

  // Function to check about product in wishlist

  async function getWishlistData(productId) {

    // Check product in wishlist 
    let wishlistProducts = await fetch('/productInWishlist', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        vendorProductId: productId,
      }),
    });

    let wishlistProductsResult = await wishlistProducts.json();
    if (wishlistProductsResult.data == false) {
      document.getElementById('wishlist').style.display = 'none'
    } else {
      if (wishlistProductsResult.data.isproductInWishlist === true) {
        document.getElementById('wishlist').setAttribute('src', '/images/user_homepage_image/filledHeart.jpg');

        let wishlistId = wishlistProductsResult.data.productsInWishlist[0].wishlist_id;

        removeFromWishlist(wishlistId, productId);

      } else if (wishlistProductsResult.data.isproductInWishlist === false) {
        document.getElementById('wishlist').setAttribute('src', '/images/user_homepage_image/wishlist.png');
        addInWishlist(productId);
      }
    }
  }

  async function removeFromWishlist(wishlistId, productId) {

    let wishlistButton = document.getElementById('wishlist');

    // wishlistButton.replaceWith(wishlistButton.cloneNode(true));

    // Now alert for removing product from wishlist
    wishlistButton.onclick = async () => {

      let removeApi = await fetch('/removeWishlistItemApi', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: wishlistId
        }),
      });

      let removeAns = await removeApi.json();
      if (removeAns.data === true) {
        setWishlistCount();
        Swal.fire({
          position: "top-end",
          icon: 'success',
          iconColor: 'hsl(176, 88%, 27%)',
          title: 'Product removed from the wishlist',
          showConfirmButton: false,
          timer: 1000,
          customClass: {
            popup: "custom-alert",
          },
        });
      }
      getWishlistData(productId);
    };
  }

  async function addInWishlist(productId) {
    let wishlistButton = document.getElementById('wishlist');

    // Remove previously existing event listner,
    // This method replaces the original wishlistButton element in the DOM with the newly created clone. As a result, 
    // the original button is removed from the DOM, and the clone is inserted in its place.

    // wishlistButton.replaceWith(wishlistButton.cloneNode(true));
    wishlistButton.onclick = async () => {
      let response = await fetch("/addInWishlist", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          vendorProductId: productId,
        }),
      });
      let result = await response.json();

      if (result.data === false) {
        alert("Login to add product to Wishlist");
      } else {
        setWishlistCount();
        // Alert
        if (result.data === true) {
          Swal.fire({
            position: "top-end",
            icon: 'success',
            iconColor: 'hsl(176, 88%, 27%)',
            title: result.message,
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: "custom-alert",
            },
          });
        }
        getWishlistData(productId);
      };
    }
  }
  // Function for getting reviews
  getReviews();

  async function getReviews() {
    // Get product id from the URL
    const searchParams = new URLSearchParams(window.location.search);
    let productId = searchParams.get("id");

    // Fetch API
    let response = await fetch(`/getReviews`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        vendorProductId: productId,
      }),
    });

    let result = await response.json();
    disReviews(result.data.result, productId);

    let userData = await fetch('/checkUserAccess');

    let userReviewAns = await userData.json();

      userReviewAns.data.orderId.forEach(element => {   
        if(element.vendor_product_id == productId){     
        disReviewButton(element.order_id, productId);
     }
  });
  }

  async function disReviewButton(orderId, productId) {
    userReviewButtonDiv.innerHTML = `<button id="add-review">Add your review</button>`;

    document.getElementById("add-review").addEventListener("click", () => {
      userReviewButtonDiv.innerHTML = ''
      userReviewButtonDiv.innerHTML += `<fieldset>
                                              <h3>Write a review</h3>
        
                                              <div class="rating-box">
                                                <p>Rating</p>
                                                <div class="stars">
                                                  <i class="fa-solid fa-star"></i>
                                                  <i class="fa-solid fa-star"></i>
                                                  <i class="fa-solid fa-star"></i>
                                                  <i class="fa-solid fa-star"></i>
                                                  <i class="fa-solid fa-star"></i>
                                                </div>
                                              </div>

                                              <form method="post" id="form-data" enctype="multipart/form-data">
                                                <div class="user-reviews">
                                                  <label for="user-add-review">Review</label>
                                                  <input type="text" name="user_review" id="user-add-review">
                                                </div>
                                                <div class="review-photos">                                                
                                                  <label for="img">Picture / Video (Optional) </label>
                                                  <input type="file" name="img" id="img" multiple/><br>
                                                </div>
                                                <div id="preview-images"></div>

                                                <button type="button" id="delete">Cancel</button>
                                                <button type="submit" id="added">Submit</button>
                                              </form>                                             
                                          </fieldset>`;

      let form = document.getElementById("form-data");
      let btn = document.getElementById("added");

      // Star review 
      const stars = document.querySelectorAll(".stars i");

      stars.forEach(async (star, index1) => {
        star.addEventListener("click", () => {

          stars.forEach((star, index2) => {

            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
          });
        });
      });

      // Cancel the review
      document.getElementById('delete').addEventListener('click', () => {
        disReviewButton(orderId, productId);
      });


      // Image preview
      document
        .getElementById("img")
        .addEventListener("change", async (e) => {
          let totalImg = e.target.files.length;
          let previewDiv = document.getElementById("preview-images");


          for (let i = 0; i < totalImg; i++) {
            const reader = new FileReader();

            reader.onload = (e) => {

              previewDiv.innerHTML += `<img
                                            src="${e.target.result}"
                                            alt="Image"
                                            style="width: 100px";                                            
                                          />`;
            };
            reader.readAsDataURL(e.target.files[i]);
          }
        });

      // Form submission
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // This will return us nodelist , so we need to pass its length
        const activeStars = document.querySelectorAll(".stars i.active");

        let reviewForm = new FormData(form);

        reviewForm.append("orderId", orderId);
        reviewForm.append("vendorProductId", productId);
        reviewForm.append("userId", "1");
        reviewForm.append('ratings', activeStars.length);

        let submitReview = await fetch("/submitReview", {
          method: "POST",
          headers: {
            "Conetent-type": "applications/json",
          },
          body: reviewForm,
        });

        let reviewResult = await submitReview.json();

        if (reviewResult.data === false) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `Error in uploading review`,
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: "custom-alert",
            },
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            iconColor: 'hsl(176, 88%, 27%)',
            title: `Thanks for your review`,
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: "custom-alert",
            },
          });
          userReviewButtonDiv.innerHTML = "";
          getReviews();
        }
      });
    });
  }

  async function disReviews(data, productId) {


    let viewAvgReview = document.getElementById('avg-review')
    let totalStar = 0;
    let totalReviews = data.length;


    data.forEach((review) => {

      // Define this because if image path is  empty string
      let imgArr = [];
      if (review.image_path !== "") {
        imgArr = review.image_path.split(",");
      }

      let imgStrHtml = "";
      let starHtml = "";
      
      let stars = review.review_rating;

      totalStar += stars;
      // Printing ratig star
      for (let i = 0; i < stars; i++) {
        starHtml += '<span class="fa fa-star checked"></span>';
      }
      for (let i = 0; i < 5 - stars; i++) {
        starHtml += '<span class="fa fa-star"></span>';
      }


      // Printing multiple image added by user
      imgArr.forEach((element) => {
        imgStrHtml += `<div class="review-img"><img src="${element}" alt="Review Image"></div>`;
      });

      // // Printing only image part
      // let reviewHtml = `<div class="user-name">${review.first_name} ${review.last_name}</div>
      //                   <div class="star">${starHtml}</div>
      //                   <div class="review">${review.review_text}</div>
      //                   <div class="review-img">${imgStrHtml}</div>`;

      // Assemble all in one
      reviewDiv.innerHTML += `<fieldset>
                                    <div class="user-name">${review.first_name} ${review.last_name}</div>
                                    <div class="star">${starHtml}</div>
                                    <div class="review">${review.review_text}</div>
                                    <div class="review-img">${imgStrHtml}</div>
                                  </fieldset>`;
    });

    let avgReview = ((totalStar) / totalReviews).toFixed(1);


    let starHtml = ''
    // Printing ratig star
    for (let i = 0; i < parseInt(avgReview); i++) {
      starHtml += '<span class="fa fa-star checked"></span>';
    }
    for (let i = 0; i < 5 - parseInt(avgReview); i++) {
      starHtml += '<span class="fa fa-star"></span>';
    }

    let html = ''
    if (totalReviews === 0) {
      html = 'No reviews for this product'
    } else {
      html = `${avgReview} out of 5 Based on ${totalReviews} customers`;
    }
    viewAvgReview.innerHTML = `<fieldset>
                              <h3>Customer reviews</h3>
                              <div class="rating-box">
                              <div class="stars">${starHtml}</div>                                                  
                              <p>${html}</p>
                            </fieldset>`;

  }