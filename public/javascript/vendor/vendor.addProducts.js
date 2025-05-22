function preview(elem, output = "") {
    Array.from(elem.files).map((file) => {
      const blobUrl = window.URL.createObjectURL(file);
      output += `<img src=${blobUrl}>`;
    });
    document.getElementsByClassName("previewArea")[0].innerHTML = output;
  }

  async function getCategories() {
    try {
      const url = `/vendor/getCategories`;
      const response = await fetch(url, {
        
      });
      const json = await response.json();
      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      }

      let category_div = document.getElementById("Category");

      html_code = `<label for="categoryId">Category</label><br><select name="category" id="categoryId"><option value="">Select Category</option>`;

      for (let i = 0; i < json.data.categoryResult.length; i++) {
        html_code += `<option value="${json.data.categoryResult[i].cat_id}">${json.data.categoryResult[i].cat_name}</option>`;
      }

      html_code += `</select>`;

      category_div.innerHTML = html_code;

      document
        .getElementById("categoryId")
        .addEventListener("change", handleCategoryChange);
    } catch (error) {
      console.log(error);
    }
  }

  getCategories();

  function handleCategoryChange() {
    var category_value = document.getElementById("categoryId").value;

    if (category_value) {
      getSubCategory(category_value);
    }
  }

  async function getSubCategory(category_value) {
    const json = await getSubCategoryDetails(category_value);

    let subCat1_div = document.getElementById("SubCategory1");

    html_code = `<label for="subCategoryId">Sub Category</label><br><select name="subCategory1" id="subCategory1Id"><option value="">Select Category</option>`;

    for (let i = 0; i < json.data.subCategoryResult.length; i++) {
      html_code += `<option value="${json.data.subCategoryResult[i].cat_id}">${json.data.subCategoryResult[i].cat_name}</option>`;
    }

    html_code += `</select>`;

    subCat1_div.innerHTML = html_code;

    document
      .getElementById("subCategory1Id")
      .addEventListener("change", handleSubCategoryChange);
  }

  function handleSubCategoryChange() {
    document.getElementById('SubCategory3').innerHTML = ''

    var subCategory_value = document.getElementById("subCategory1Id").value;

    if (subCategory_value) {
      getSubCategory2(subCategory_value);
    }

    let cat_id = document.getElementById('subCategory1Id').value
    if(cat_id != ''){
      generateSizeOption(cat_id)
    }else{
      document.getElementById('SubCategory2').innerHTML = ''
    }
  }

  async function getSubCategory2(category_value) {
    const json = await getSubCategoryDetails(category_value);

    let subCat1_div = document.getElementById("SubCategory2");

    html_code = `<label for="subCategory2Id">Sub Category</label><br><select name="subCategory2" id="subCategory2Id"><option value="">Select Category</option>`;

    for (let i = 0; i < json.data.subCategoryResult.length; i++) {
      html_code += `<option value="${json.data.subCategoryResult[i].cat_id}">${json.data.subCategoryResult[i].cat_name}</option>`;
    }

    html_code += `</select>`;

    subCat1_div.innerHTML = html_code;

    document
      .getElementById("subCategory2Id")
      .addEventListener("change", handleSubCategory2Change);
  }

  function handleSubCategory2Change() {
    var subCategory_value = document.getElementById("subCategory2Id").value;

    if (subCategory_value) {
      getSubCategory3(subCategory_value);
    }
  }

  async function getSubCategory3(category_value) {
    const json = await getSubCategoryDetails(category_value);

    let subCat1_div = document.getElementById("SubCategory3");

    html_code = `<label for="subCategory3Id">Sub Category</label><br><select name="subCategory3" id="subCategory3Id"><option value="">Select Category</option>`;

    for (let i = 0; i < json.data.subCategoryResult.length; i++) {
      html_code += `<option value="${json.data.subCategoryResult[i].cat_id}">${json.data.subCategoryResult[i].cat_name}</option>`;
    }

    html_code += `</select>`;

    subCat1_div.innerHTML = html_code;

  }

  async function getSubCategoryDetails(category_value) {
    const url = "/vendor/getSubCategory";
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ category_id: category_value }),
      });

      const json = await response.json();

      if (!json.data.success) {
        alert(json.message);
        window.location.href = "/auth/vendor-login";
      }
      return json;
    } catch (error) {
      console.error(error);
    }
  }

  document
    .getElementById("productFormId")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementsByClassName('submitBtn')[0].disabled = true
      document.getElementsByClassName('loaderParent')[0].style.display = 'block'

      const formdata = new FormData(document.getElementById("productFormId"));

      const url = "/vendor/productsData";
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formdata,
        });

        const json = await response.json();
        document.getElementsByClassName('submitBtn')[0].disabled = false
        document.getElementsByClassName('loaderParent')[0].style.display = 'none'


        if(json.message == 'your session has been expired'){
          window.location.href = "/auth/vendor-login";
        }

        if (!json.data.success) {
          alert(json.message);
        } else {
          alert("product added successfully");
          window.location.href = "/vendor/getProducts";
        }
      } catch (error) {
        console.error(error);
      }
    });

  const cssColors =  [
`AliceBlue`,
`AntiqueWhite`,
`Aqua`,
`Aquamarine`,
`Azure`,
`Beige`,
`Bisque`,
`Black`,
`BlanchedAlmond`,
`Blue`,
`BlueViolet`,
`Brown`,
`BurlyWood`,
`CadetBlue`,
`Chartreuse`,
`Chocolate`,
`Coral`,
`CornflowerBlue`,
`Cornsilk`,
`Crimson`,
`Cyan`,
`DarkBlue`,
`DarkCyan`,
`DarkGoldenRod`,
`DarkGray`,
`DarkGrey`,
`DarkGreen`,
`DarkKhaki`,
`DarkMagenta`,
`DarkOliveGreen`,
`Darkorange`,
`DarkOrchid`,
`DarkRed`,
`DarkSalmon`,
`DarkSeaGreen`,
`DarkSlateBlue`,
`DarkSlateGray`,
`DarkSlateGrey`,
`DarkTurquoise`,
`DarkViolet`,
`DeepPink`,
`DeepSkyBlue`,
`DimGray`,
`DimGrey`,
`DodgerBlue`,
`FireBrick`,
`FloralWhite`,
`ForestGreen`,
`Fuchsia`,
`Gainsboro`,
`GhostWhite`,
`Gold`,
`GoldenRod`,
`Gray`,
`Grey`,
`Green`,
`GreenYellow`,
`HoneyDew`,
`HotPink`,
`IndianRed`,
`Indigo`,
`Ivory`,
`Khaki`,
`Lavender`,
`LavenderBlush`,
`LawnGreen`,
`LemonChiffon`,
`LightBlue`,
`LightCoral`,
`LightCyan`,
`LightGoldenRodYellow`,
`LightGray`,
`LightGrey`,
`LightGreen`,
`LightPink`,
`LightSalmon`,
`LightSeaGreen`,
`LightSkyBlue`,
`LightSlateGray`,
`LightSlateGrey`,
`LightSteelBlue`,
`LightYellow`,
`Lime`,
`LimeGreen`,
`Linen`,
`Magenta`,
`Maroon`,
`MediumAquaMarine`,
`MediumBlue`,
`MediumOrchid`,
`MediumPurple`,
`MediumSeaGreen`,
`MediumSlateBlue`,
`MediumSpringGreen`,
`MediumTurquoise`,
`MediumVioletRed`,
`MidnightBlue`,
`MintCream`,
`MistyRose`,
`Moccasin`,
`NavajoWhite`,
`Navy`,
`OldLace`,
`Olive`,
`OliveDrab`,
`Orange`,
`OrangeRed`,
`Orchid`,
`PaleGoldenRod`,
`PaleGreen`,
`PaleTurquoise`,
`PaleVioletRed`,
`PapayaWhip`,
`PeachPuff`,
`Peru`,
`Pink`,
`Plum`,
`PowderBlue`,
`Purple`,
`Red`,
`RosyBrown`,
`RoyalBlue`,
`SaddleBrown`,
`Salmon`,
`SandyBrown`,
`SeaGreen`,
`SeaShell`,
`Sienna`,
`Silver`,
`SkyBlue`,
`SlateBlue`,
`SlateGray`,
`SlateGrey`,
`Snow`,
`SpringGreen`,
`SteelBlue`,
`Tan`,
`Teal`,
`Thistle`,
`Tomato`,
`Turquoise`,
`Violet`,
`Wheat`,
`White`,
`WhiteSmoke`,
`Yellow`,
`YellowGreen`,
]

let colorOptionHtmlCode;

cssColors.forEach((color) => {
colorOptionHtmlCode += `<option value="${color}">${color}</option>`
})
document.getElementById('colorId').innerHTML += colorOptionHtmlCode

const sizeData = {
"7" : ["2gb ram","4gb ram","6gb ram","8gb ram","12gb ram"],
"35" : ["0.75-ton AC","1-ton AC","1.5-ton AC","2-ton AC","2.5-3 ton AC"],
"46" : ["Small","Medium","Large"],
"50" : ["32 inch","40 inch","43 inch","48 inch","50 inch"],
"14" : ["S","M","L","XL","XXL"],
"15" : ["S","M","L","XL","XXL"],
"16" : ["0-2 months","2-6 months","2-6 months","6-12 months","1-2 years","2-3 years","3-5 years","5-7 years","8-10 years","10-13 years",],
}

function generateSizeOption (cat_id){

let sizeOptionHtmlCode = `<option value="">Select size</option>`;
let sizeOptionArray = sizeData[cat_id]
sizeOptionArray.forEach((size) => {
sizeOptionHtmlCode += `<option value="${size}">${size}</option>`

}
)
document.getElementById('sizeId').innerHTML = sizeOptionHtmlCode
}
