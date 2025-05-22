function preview(elem, output = "") {
    Array.from(elem.files).map((file) => {
      const blobUrl = window.URL.createObjectURL(file);
      output += `<img src=${blobUrl} width="100" height="100">`;
    });
    document.getElementsByClassName("previewArea")[0].innerHTML = output;
  }

  document
    .getElementById("productFormId")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formdata = new FormData(document.getElementById("productFormId"));

      const urlParams = new URLSearchParams(window.location.search);
      const vendorProductId = urlParams.get("vendorProductID");

      const url = `/vendor/postEditProductDetails?vendorProductID=${vendorProductId}`;
      try {
        const response = await fetch(url, {
          method: "POST",
         
          body: formdata,
        });

        const json = await response.json();
        if(json.message == 'your session has been expired'){
          window.location.href = "/auth/vendor-login";
        }
        if (!json.data.success) {
          alert(json.message);
        }
        if (json.data.success) {
          alert("product updated successfully");
          window.location.href = "/vendor/getProducts";
        }
      } catch (error) {
        console.error(error);
      }
    });

  async function getData() {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorProductId = urlParams.get("vendorProductID");

    const url = `/vendor/getEditProductDetails?vendorProductID=${vendorProductId}`;

    try {
      const response = await fetch(url, {
        
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      }
      if (json.data.editProductDeatilResult.length == 0) {
        document.getElementsByClassName("main-div")[0].innerHTML =
          "There is no product";
        return;
      }
      
      

      let images = json.data.editProductDeatilResult[0].image_path
        .toString()
        .split(",");
      let html = ``;
      images.forEach((e) => {
        html += `<img src = '${e}'></img>`;
      });
      document.getElementById("imagePreview").innerHTML = html;
      document.getElementById("titleId").value =
        json.data.editProductDeatilResult[0].product_name;
      document.getElementById("descriptionId").value =
        json.data.editProductDeatilResult[0].description;
    } catch (error) {
      console.log(error);
    }
  }
  getData();