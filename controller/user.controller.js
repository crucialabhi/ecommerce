//User controller
import connection from "../database/connection.js";
import generalResponse from "../helpers/generalResponse.js";
import { hashData, verifyHashData } from "../middleware/bcrypt.js";
import { getDataFromToken } from "../middleware/jwtToken.js";
import { uploadOnCloude } from "../middleware/cloudinary.js";
import PDFDocument from "pdfkit";
import pkg from 'pdfkit';
const { lineGap } = pkg;
import axios from "axios";
import Joi from "joi";
// import { any } from "joi";
import setOfferPrice from "../helpers/setOfferPrice.js";
import { updateProfileSchema, userAddressSchema } from "../middleware/joiValidation.js";
import { orderplacedmail } from "../middleware/nodeMailer.js";
const { any } = Joi;

//Get controllers:
// Homepage, Cartpage, ProductListing, SingleProduct,ShopByCategories,CheckoutPage,wishlistPage,noProduct,getOrderSummary,
// aboutUsPage,contactUs,privacyPolicy, termsAndConditions,singleOrderRedirect, refundForm,userProfileDetails,billPreview

export const homePage = async (req, res) => {
  res.render("user/home");
};

export const cartPage = async (req, res) => {
  res.render("user/cart");
};

export const productListngPage = async (req, res) => {
  res.render("user/shopProduct.ejs");
};

export const singleProductDetailPage = (req, res) => {
  res.render("user/singleProductView.ejs");
};

export const shopByCategories = async (req, res) => {
  res.render("user/shopByCategory.ejs");
};

export const checkoutPage = async (req, res) => {
  res.render("user/checkout");
};

export const wishlistPage = async (req, res) => {
  res.render("user/wishlist");
};

export const noProduct = async (req, res) => {
  res.render("user/noProduct.ejs");
};

export const getOrderSummary = async (req, res) => {
  res.render("user/orderSummary", { productId: req.query.productId });
};

export const aboutUsPage = async (req, res) => {
  res.render("user/aboutUs");
};

export const contactUs = async (req, res) => {
  res.render("user/contactUs");
};

export const privacyPolicy = async (req, res) => {
  res.render("user/privacyPolicy");
};

export const termsAndConditions = async (req, res) => {
  res.render("user/T&C");
};

export const singleOrderRedirect = async (req, res) => {
  res.render("user/singleOrderRedirect");
};

export const refundForm = async (req, res) => {
  res.render("user/refundForm");
};

export const userProfileDetails = async (req, res) => {
  res.render("user/profile");
};

export const billPreview = async (req, res) => {
  res.render("user/billPreview");
};

export const thankYou = (req, res) => {
  res.render("user/thankyou");
}

export const checkUserLogin = (req, res) => {
  return res.status(200).json(generalResponse("Logged in"));
}

export const completePaymentPage = async (req, res) => {
  res.render('user/completePaymentPage');
}

export const cancelPaymentPage = async (req, res) => {
  res.render('user/cancelPaymentPage');
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("userToken");
    res.status(200).json(generalResponse("Logout Successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

//-------------------------------------------Data Controllers----------------------------------------//

export const fetchAdresssForCheckoutApi = async (req, res) => {
  try {
    let userId = req.body.userInfo.user_id;
    let getAddress = `SELECT uat.address_id,ut.email, ut.user_id,ut.first_name, ut.last_name, uat.address, uat.pin_code, uat.city, uat.state, ut.mobile_number
  FROM user_table ut
   JOIN user_address_table uat
  ON ut.user_id = uat.user_id where ut.user_id = ${userId} AND uat.is_deleted = 0;`;
    let [getAddressResult] = await connection.query(getAddress);

    return res.status(201).json(generalResponse("done", getAddressResult));
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const wishListData = async (req, res) => {
  try {
    let userId = req.body.userInfo.user_id;
    let getWishListDataQuery = `SELECT w.wishlist_id, w.user_id, w.vendor_product_id, w.created_at AS wishlist_created_at,
       v.product_name, v.price, v.stock, v.available_stock, v.description, v.image_path, v.category_id,v.is_active
FROM wishlist_table w
JOIN vendor_product_details v ON w.vendor_product_id = v.vendor_product_id
WHERE w.user_id = ${userId} AND w.is_deleted = 0 AND v.is_active = 1 AND v.is_deleted = 0; `;

    let [getWishListDataResult] = await connection.query(getWishListDataQuery);

    let getWishListData = await setOfferPrice(getWishListDataResult);

    return res.status(200).send(generalResponse("done", getWishListData));
  } catch (error) {
    console.log(error);
    res.status(400).send(generalResponse("something went wrong"));
  }
};

export const productDetail = async (req, res) => {
  let type = req.body.type;
  try {

    let vendorProductDetailsResult;
    if (type === 'new-added') {
      [vendorProductDetailsResult] = await connection.query(
        `SELECT * FROM vendor_product_details WHERE is_active = 1 AND is_deleted = 0 ORDER BY created_at DESC LIMIT 8`
      );
    } else if (type === 'popular') {
      [vendorProductDetailsResult] = await connection.query(`
        select rt.vendor_product_id , avg(rt.review_rating) AS avg_rating, vpd.* FROM 
        review_table rt 
        JOIN vendor_product_details vpd 
        ON rt.vendor_product_id=vpd.vendor_product_id WHERE vpd.is_active = 1 AND vpd.is_deleted = 0
        GROUP BY rt.vendor_product_id , vpd.vendor_product_id 
        ORDER BY avg_rating DESC LIMIT 8`);
    } else if (type === 'featured') {
      [vendorProductDetailsResult] = await connection.query(`SELECT * FROM vendor_product_details WHERE is_active = 1 AND is_deleted = 0 ORDER BY RAND() LIMIT 8`);
    } else {
      [vendorProductDetailsResult] = await connection.query(`SELECT * FROM vendor_product_details WHERE is_active = 1 AND is_deleted = 0`);
    }
    let productDetails = await setOfferPrice(vendorProductDetailsResult);
    return res
      .status(200)
      .send(
        generalResponse(
          "Data fetched from vendor details",
          productDetails
        )
      );
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const singleProductDetail = async (req, res) => {
  try {
    let vendorProductId = req.query.id;
    let [singleProductResult] = await connection.query(
      `SELECT * FROM vendor_product_details WHERE vendor_product_id = ${vendorProductId} AND is_active = 1 AND is_deleted = 0`
    );

    let singleProduct = await setOfferPrice(singleProductResult);
    return res
      .status(200)
      .send(
        generalResponse("Data fetched from vendor details", singleProduct)
      );
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const addInWishlist = async (req, res) => {
  try {
    let data = req.body;
    let vendorProductId = data.vendorProductId;
    let userId = data.userInfo.user_id;
    let checkItemExists;

    let [checkItem] = await connection.query(`SELECT is_deleted FROM wishlist_table WHERE user_id = ${userId} AND vendor_product_id = ${vendorProductId}`);

    if (checkItem.length == 0) {
      let [addInWishListResult] = await connection.query(`INSERT INTO wishlist_table (user_id,vendor_product_id) VALUES (${userId},${vendorProductId})`);
      return res.status(200).send(generalResponse("Product added in wishlist", true));
    } else {
      checkItemExists = checkItem[0].is_deleted;
      if (checkItemExists == 0) {
        return res.status(202).send(generalResponse("Product already in wishlist", false));
      } else if (checkItemExists == 1) {
        let [updateWishList] = await connection.query(`UPDATE wishlist_table SET is_deleted = 0 WHERE user_id = ${userId} AND vendor_product_id = ${vendorProductId}`);
        return res.status(200).send(generalResponse("Product added in wishlist", true));
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse("Something went wrong"));
  }
};

export const addInCart = async (req, res) => {
  try {
    let data = req.body;
    let vendorProductId = data.vendorProductId;
    let userId = data.userInfo.user_id;
    let categoryId = data.categoryId;
    let checkItemExists;
    let [checkItem] = await connection.query(
      `SELECT quantity, is_deleted FROM cart WHERE user_id = ${userId} AND vendor_product_id = ${vendorProductId}`
    );
    if (checkItem.length == 0) {
      let [addInCartResult] = await connection.query(
        `INSERT INTO cart (category_id ,vendor_product_id,user_id) VALUES (${categoryId},${vendorProductId},${userId})`
      );
      return res.status(200).send(generalResponse("Data inserted into cart table", true));
    } else {
      checkItemExists = checkItem[0].is_deleted;
      if (checkItemExists == 0) {
        let updateExistingQuantityQuery = `update cart set quantity = quantity + 1, is_deleted = 0 where user_id = ${userId} AND vendor_product_id = ${vendorProductId} AND is_deleted = 0;`;
        let [updateExistingQuantityQueryResult] = await connection.query(updateExistingQuantityQuery);
        return res.status(200).send(generalResponse("Data inserted into cart table", true));
      } else if (checkItemExists == 1) {
        let updateNonExistingQuantityQuery = `update cart set quantity = 1, is_deleted = 0 where user_id = ${userId} AND vendor_product_id = ${vendorProductId};`;
        let [updateNonExistingQuantityQueryResult] = await connection.query(updateNonExistingQuantityQuery);
        return res.status(200).send(generalResponse("Data inserted into cart table", true));
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse(error.message, false));
  }
};

export const getCategoryData = async (req, res) => {
  try {
    let [getCategoryDataResult] = await connection.query(
      `SELECT * FROM categories WHERE parent_cat_id =0`
    );


    return res.status(200).send(generalResponse("Data fetched from categories table", getCategoryDataResult));
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const singleCategoryProducts = async (req, res) => {
  try {
    let categoryId = req.query.id;
    let [singleCategoryProductsResult] = await connection.query(
      `SELECT * FROM vendor_product_details where category_id =${categoryId} AND is_active = 1 AND is_deleted = 0`
    );
    let getCategoryDetail = await setOfferPrice(singleCategoryProductsResult);


    if (singleCategoryProductsResult.length > 0) {
      return res.status(200).send(generalResponse("Data fetched from vendor details", getCategoryDetail));
    } else {
      return res
        .status(200)
        .send(generalResponse("No data for this category", false));
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const cartDataApi = async (req, res) => {
  try {
    let userId = req.body.userInfo.user_id;

    let cartDataQuery = `SELECT c.cart_id, v.description, v.category_id, c.user_id, c.quantity, c.vendor_product_id, v.product_name, v.price,v.image_path,v.is_active
    FROM cart c
    JOIN vendor_product_details v ON c.vendor_product_id = v.vendor_product_id
    WHERE c.user_id = ${userId} AND c.is_deleted = 0 AND v.is_active = 1 AND v.is_deleted = 0;`;
    let [cartDataQueryResult] = await connection.query(cartDataQuery);

    let getCartData = await setOfferPrice(cartDataQueryResult);

    return res.status(200).json(generalResponse("done", getCartData));
  } catch (error) {
    console.log(error);
    res.status(400).json("something went wrong");
  }
};

export const removeItemFromCartApi = async (req, res) => {
  try {
    let cartId = req.body.cart_id;
    let removeItemFromCartQuery = `UPDATE cart SET is_deleted = 1 WHERE cart_id= ${cartId};`;
    let [removeItemFromCartResult] = await connection.query(
      removeItemFromCartQuery
    );

    return res.status(200).json(generalResponse("done"));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("something went wrong"));
  }
};

export const beforeCheckoutPageQuantityCheckApi = async (req, res) => {
  try {
    const quantities = req.body;
    const vendorProductIds = quantities.map((item) => item.venderProductId);
    const [quantityCheckResult] = await connection.query(
      `SELECT vendor_product_id, is_active,available_stock FROM vendor_product_details WHERE vendor_product_id IN (?) AND is_deleted = 0`,
      [vendorProductIds]
    );

    const stockMap = {};

    const errors = [];
    quantityCheckResult.forEach((row) => {
      if (row.is_active == 0) {
        errors.push(
          ` this ##${row.vendor_product_id}##  not Available`
        );
      } else {

        stockMap[row.vendor_product_id] = row.available_stock;
      }
    });
    quantities.forEach((item) => {
      const availableStock = stockMap[item.venderProductId];
      if (availableStock === undefined) {
        // errors.push(`Product ID ${item.venderProductId} does not exist.`);
      } else if (item.quantity > availableStock) {
        errors.push(
          ` Insufficient stock for ##${item.venderProductId}## Available: ${availableStock}, Requested: ${item.quantity}`
        );
      }
    });
    if (errors.length > 0) {
      return res.status(202).json(generalResponse(false, errors));
    }

    return res.status(200).json(generalResponse(`All quantities are valid`));
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const postCategoryData = async (req, res) => {
  try {
    let [postCategoryDataResult] = await connection.query(
      `select * from categories where parent_cat_id = (?)`,
      [req.body.id]
    );
    return res
      .status(200)
      .json(generalResponse("done", postCategoryDataResult));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse(error.message, null));
  }
};

export const allReviews = async (req, res) => {
  try {
    let vendorProductId = req.body.vendorProductId;
    let [userReviewResult] = await connection.query(
      `SELECT ut.user_id, ut.first_name, ut.last_name, rt.image_path, rt.review_rating, rt.review_text 
      FROM review_table rt 
      JOIN user_table ut ON rt.user_id = ut.user_id 
      WHERE rt.vendor_product_id = ?`,
      [vendorProductId]
    );

    res.status(404).send(generalResponse("Data fetched from reviews", { result: userReviewResult }));

  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const userAccess = async (req, res) => {

  let userId = req.body.userInfo.user_id;

  let [canUserReview] =
    await connection.query(`SELECT ot.order_id , ot.product_id ,p.vendor_product_id FROM order_details ot 
    JOIN products p ON ot.product_id = p.products_id WHERE ot.user_id = ${userId}`);

  return res.status(200).send(generalResponse('Data fetched for user access', {
    orderId: canUserReview
  }))
}

export const productInWishlist = async (req, res) => {
  try {

    let userId = req.body.userInfo.user_id;

    if ('vendorProductId' in req.body) {

      // .log('vendorProductId' in req.body);
      if ('vendorProductId' in req.body) {

        let venderProductId = req.body.vendorProductId;
        let [productInWishlist] =
          await connection.query(`SELECT wishlist_id from wishlist_table where user_id = ${userId} AND vendor_product_id = ${venderProductId} AND is_deleted=0`);

        if (productInWishlist.length > 0) {
          return res.status(200).send(generalResponse('Data fetched to check products are in wishlist', {
            isproductInWishlist: true,
            productsInWishlist: productInWishlist
          }));
        } else {
          return res.status(200).send(generalResponse('Data fetched to check products are in wishlist', {
            isproductInWishlist: false,
          }));
        }
      }

    }
    let [productInWishlist] =
      await connection.query(`SELECT wishlist_id ,vendor_product_id from wishlist_table 
                          where user_id = ${userId} AND is_deleted=0`);



    if (productInWishlist.length > 0) {
      return res.status(200).send(generalResponse('Data fetched to check products are in wishlist', {
        isContain: true,
        productsInWishlist: productInWishlist
      }));
    }
    else {
      return res.status(200).send(generalResponse('Data fetched to check products are in wishlist', {
        isContain: false,
        productsInWishlist: []
      }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(generalResponse('Internal Server Error', false))
  }

}

export const addReview = async (req, res) => {
  try {
    let data = req.body;
    let file = req.files;
    let review = data.user_review;
    let rating = data.ratings;
    let imageArr = [];
    let userId = req.body.userInfo.user_id;

    for (let i = 0; i < file.length; i++) {
      let path = file[i].path;
      let image = await uploadOnCloude(path);

      imageArr.push(image.url);
    }

    let imageStr = imageArr.join();
    let [insertReviewResult] = await connection.query(`INSERT INTO review_table 
      (user_id , order_id , vendor_product_id , image_path ,review_rating ,review_text) VALUES
      (${userId} , ${data.orderId} , ${data.vendorProductId} ,'${imageStr}' ,${rating} ,'${review}')`);

    return res
      .status(200)
      .send(generalResponse("Data inserted successfully", insertReviewResult));
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse("Error inserting data", false));
  }
};

export const singleOrderDetails = async (req, res) => {
  try {
    let order_id = req.body.order_id;
    let singleOrderDetailsQuery = `SELECT ot.order_id , ot.product_id ,ot.address_id , ot.order_date ,ot.order_status, ot.delivery_date,
      ot.product_price,p.vendor_product_id ,vpd.product_name , vpd.image_path ,vpd.is_active,
      uat.address , uat.pin_code , uat.city ,uat.state FROM order_details ot 
      JOIN user_address_table uat ON ot.address_id = uat.address_id
      JOIN products p ON ot.product_id = p.products_id
      JOIN vendor_product_details vpd ON p.vendor_product_id = vpd.vendor_product_id WHERE ot.order_id = ${order_id} AND vpd.is_active = 1 AND vpd.is_deleted = 0;`;

    let [singleOrderDetailsResult] = await connection.query(
      singleOrderDetailsQuery
    );

    let refundRequestExist = `SELECT * from refund_details WHERE order_id = ${order_id};`;
    let [refundRequestExistResult] = await connection.query(refundRequestExist);

    if (refundRequestExistResult.length == 0) {
      return res
        .status(200)
        .send(
          generalResponse(
            "Refund request does not exist",
            singleOrderDetailsResult[0]
          )
        );
    } else if (refundRequestExistResult.length > 0) {
      return res
        .status(200)
        .send(
          generalResponse(
            "Refund request already exist",
            singleOrderDetailsResult[0]
          )
        );
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(generalResponse(false));
  }
};

export const detailsForRefund = async (req, res) => {
  try {
    let query = `SELECT 
  vpd.product_name,
  ot.product_price,
  ot.delivery_date,
  payment.payment_id,
  vpd.is_active
FROM order_details ot 
JOIN products p ON ot.product_id = p.products_id
JOIN vendor_product_details vpd ON p.vendor_product_id = vpd.vendor_product_id
LEFT JOIN payment_table payment ON ot.order_id = payment.order_id
WHERE ot.order_id = ${req.body.orderId} AND vpd.is_active = 1 AND vpd.is_deleted = 0;
`;
    let [result] = await connection.query(query);
    return res.status(200).send(generalResponse(true, result[0]));
  } catch (error) {
    console.log(error)
    res.status(400).send(generalResponse("Something went wrong", false));
  }
};

export const submitRefundData = async (req, res) => {
  try {
    let userId = req.body.userInfo.user_id; //take this user Id fro

    let query = "";
    if (req.body.reason == "other") {
      query = `INSERT INTO refund_details (user_id , order_id , payment_id , refund_reason , requested_at , refund_status) VALUES ('${userId}', ${req.body.orderId}, ${req.body.paymentId}, '${req.body.userReason}', CURRENT_TIMESTAMP , 'pending')`;
    } else {
      query = `INSERT INTO refund_details (user_id , order_id , payment_id , refund_reason , requested_at , refund_status) VALUES ('${userId}', ${req.body.orderId}, ${req.body.paymentId}, '${req.body.reason}', CURRENT_TIMESTAMP , 'pending')`;
    }
    let [result] = await connection.query(query);
    res
      .status(200)
      .send(generalResponse("Refund request submitted successfully.", true));
  } catch (err) {
    console.log(err);
    res.status(400).send(generalResponse("Something went wrong", false));
  }
};

export const posttermsAndConditions = async (req, res) => {
  try {
    let termsAndConditionsQuery = `select * from dynamic_data where values_for = "terms-and-condition" and  is_deleted = "0"`;
    let [termsAndConditionsQueryResult] = await connection.query(
      termsAndConditionsQuery
    );
    return res
      .status(200)
      .json(generalResponse("t&c fetched", termsAndConditionsQueryResult));
  } catch (error) {
    return res.status(404).json(generalResponse(error.message));
  }
};

export const postprivacypolicy = async (req, res) => {
  try {
    let privacyPolicyQuery = `select * from dynamic_data where values_for = "privacy-policy" and  is_deleted = "0"`;
    let [privacyPolicyResult] = await connection.query(privacyPolicyQuery);
    return res
      .status(200)
      .json(generalResponse("privacy policies fetched", privacyPolicyResult));
  } catch (error) {
    return res.status(404).json(generalResponse(error.message));
  }
};

export const postPlaceOrderData = async (req, res) => {
  try {
    let taxRate = 18;
    let userId = req.body.userInfo.user_id;
    let group_id = Date.now()
    let delivery_days = 4;
    let delivery_charge = 50;
    let { buyingItemArray } = req.body;

    let { currAddress } = req.body;
    let { first_name, last_name, address, pin_code, city, state } = currAddress;
    let vendor_id_object = {};
    let admin_commission_qry = `SELECT content FROM dynamic_data WHERE title = 'commission';`

    let [commission_rate] = await connection.query(admin_commission_qry)
    let commission_rate_value = +commission_rate[0].content;

    for (let singleItem of buyingItemArray) {
      let {
        vendor_product_id,
        quantity,
        offer_price,
        cart_id,
        product_name,
        description,
        category_id
      } = singleItem;

      let productsQuery = `SELECT products_id FROM products WHERE vendor_product_id = ${vendor_product_id} AND is_sold = 0`;

      let [productsResult] = await connection.query(productsQuery);

      let itemForUser = productsResult.slice(0, quantity);

      const ProductIds = itemForUser.map((item) => item.products_id);

      let soldProductQuery = `UPDATE products SET is_sold = 1 WHERE products_id IN (${ProductIds.join(
        ","
      )})`;

      let [soldResult] = await connection.query(soldProductQuery);

      let qryForVendor_id = `SELECT vendor_id, is_active,vendor_product_id FROM vendor_product_details WHERE vendor_product_id = ${vendor_product_id} AND is_active = 1 AND is_deleted = 0`;

      let [result_vendor_id_find] = await connection.query(qryForVendor_id);
      vendor_id_object[vendor_product_id] = result_vendor_id_find[0].vendor_id;

      let qryForGetTax = `SELECT s_gst,c_gst FROM tax_table WHERE parent_category_id = ${category_id}`;

      let [result_tax_find] = await connection.query(qryForGetTax);
      let s_gst, c_gst
      if (result_tax_find.length == 0) {
        s_gst = 5
        c_gst = 5
      } else {
        s_gst = result_tax_find[0].s_gst;
        c_gst = result_tax_find[0].c_gst;
      }

      taxRate = s_gst + c_gst


      let admin_commission_amount = ((offer_price * commission_rate_value) / 100).toFixed(2);

      for (let i = 0; i < ProductIds.length; i++) {

        let insertQryintoOrderTableQry = `INSERT INTO order_details (user_id, product_id, vendor_id, address_id, order_date, order_status, product_price, delivery_date,group_id,admin_commission) VALUES
         (${userId}, ${ProductIds[i]}, ${vendor_id_object[vendor_product_id]},${currAddress.address_id} , NOW(), 'vendorVerification', '${offer_price}', DATE_ADD(NOW(), INTERVAL ${delivery_days} DAY),'${group_id}',${admin_commission_amount});`;

        let [result_of_order] = await connection.query(
          insertQryintoOrderTableQry
        );
        let lastInsertOrderId = result_of_order.insertId;
        let getVendorDetails = `SELECT * FROM vendor_details WHERE vendor_id = ${vendor_id_object[vendor_product_id]};`;

        let [getVendorDetailsResult] = await connection.query(getVendorDetails);

        let customerName =
          first_name.replace(/'/g, "\\'") +
          " " +
          last_name.replace(/'/g, "\\'");
        let productInsertName = product_name.replace(/'/g, "\\'");
        let insertAddress =
          address.replace(/'/g, "\\'") +
          " " +
          city +
          " " +
          state +
          " " +
          pin_code;
        let insertDescription = description.replace(/'/g, "\\'");
        let insertVendorName =
          getVendorDetailsResult[0].first_name +
          " " +
          getVendorDetailsResult[0].last_name;
        let insertVendorAddress =
          getVendorDetailsResult[0].city +
          " " +
          getVendorDetailsResult[0].state +
          " " +
          getVendorDetailsResult[0].pincode;

        let bill_insert_query = `INSERT INTO bill_table (user_id, product_id, product_price, order_id, vendor_id, 
          productName, customerName, customerAddress, productDetails, taxRate, deliveryCharge, vendorName, companyName,
          companyAddress, bill_status,vendor_email,vendor_company_name,vendor_gst_no,vendor_address,s_gst,c_gst) 
          VALUES (
          ${userId},
          ${ProductIds[i]},
          ${offer_price},
          ${lastInsertOrderId},
          ${vendor_id_object[vendor_product_id]},
          '${productInsertName}',
          '${customerName}',       
          '${insertAddress}',
          '${insertDescription}',
          ${taxRate},                 
          ${delivery_charge},
          '${insertVendorName}',
          'EVARA E-commerce, The Company of MR',
          'RG road , Visavadar, junagadh, 362130',
          'pending',
          '${getVendorDetailsResult[0].email}',
          '${getVendorDetailsResult[0].company_name}',
          '${getVendorDetailsResult[0].gst_number}',
          '${insertVendorAddress}',
          ${s_gst},
          ${c_gst}
        );`;

        await connection.query(bill_insert_query);

        // fetching data for sending mail for order placed successfully
        let [productName] = await connection.query(`select products_name from products where products_id = ${vendor_product_id}`)
        let [Email] = await connection.query(`select email from user_table where user_id = ${userId}`)
        // await connection.query(deleteCartQry)
        let totalAmount = delivery_charge + taxRate + offer_price;
        let mail = Email[0].email;
        let pname = productName[0].products_name;
        console.log(mail);
        orderplacedmail(mail, pname, totalAmount)
      }

      if (singleItem['cart_id'] != undefined) {
        let deleteCartQry = `UPDATE cart SET is_deleted = 1 WHERE cart_id = ${cart_id} ;`;
        await connection.query(deleteCartQry);
      }

      let updateStock = `UPDATE vendor_product_details SET available_stock = available_stock - ${quantity} WHERE vendor_product_id = ${vendor_product_id};`;
      await connection.query(updateStock);
    }


    return res.status(200).json(generalResponse("done"));
  } catch (error) {
    console.log(error);
    res.status(500).json(generalResponse("something went wrong"));
  }
};

export const addNewAddressFromCheckout = async (req, res) => {
  try {
    let data = {
      address: req.body.address,
      pin_code: req.body.pin_code,
      city: req.body.city,
      state: req.body.state,
    };
    const { error } = userAddressSchema.validate(data);
    if (error) {
      console.log(error.details[0].message);
      return res.status(410).json(generalResponse(error.details[0].message, false));
    }

    let insertAddress = `INSERT INTO user_address_table(user_id, address, pin_code, city, state, created_at) VALUES (${req.body.userInfo.user_id}, '${req.body.address}', '${req.body.pin_code}', '${req.body.city}', '${req.body.state}', CURRENT_TIMESTAMP)`;
    await connection.query(insertAddress);
    return res.status(200).json(generalResponse("done", true));
  }
  catch (err) {
    console.log(err);
    return res.status(404).json(generalResponse(err.message, false));
  }
}


export const deletAddress = async (req, res) => {
  try {
    let deleteAddressQry = `DELETE FROM user_address_table WHERE address_id = ${req.body.address_id};`;
    await connection.query(deleteAddressQry);
    return res.status(200).json(generalResponse("Address deleted", true));
  } catch (error) {
    console.log(error);
    return res.status(400).json(generalResponse("something went wrong", false));
  }
}



export const removeWishlistItemApi = async (req, res) => {
  try {
    let wishlistId = req.body.id;
    let qry = `UPDATE wishlist_table SET is_deleted = 1 WHERE wishlist_id = ${wishlistId}`;

    await connection.query(qry);
    return res.status(200).json(generalResponse("done", true));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("something went wrong"));
  }
};

export const userDashboard = async (req, res) => {
  try {
    const email = req.body.userInfo.email;

    const getUserDetails = `select * from user_table where email ='${email}'`;
    const [resultUserDetails] = await connection.query(getUserDetails);

    let userId = req.body.userInfo.user_id;
    const getUserAddress = `select * from user_address_table where user_id ='${userId}'`;
    const getUserOrders = `select * from order_details where user_id ='${userId}'`;
    const [resultUserAddress] = await connection.query(getUserAddress);
    const [resultUserorders] = await connection.query(getUserOrders);

    const productDetails = [];
    if (resultUserorders.length != 0) {
      for (let i = 0; i < resultUserorders.length; i++) {
        let productId = resultUserorders[i]["product_id"];
        let getUserOrdersProductDetails = `SELECT product_name ,vendor_product_details.price ,image_path FROM vendor_product_details left join products on vendor_product_details.vendor_product_id = products.vendor_product_id WHERE products.products_id = ${productId} AND vendor_product_details.is_deleted = 0 ;`;
        let [resultOfOrdersProductDetails] = await connection.query(
          getUserOrdersProductDetails
        );

        let imagePathSlice =
          resultOfOrdersProductDetails[0]["image_path"].split(",");
        let imagePath = imagePathSlice[0];
        productDetails.push({
          productName: resultOfOrdersProductDetails[0]["product_name"],
          orderId: resultUserorders[i]["order_id"],
          image: imagePath,
          deliveryStatus: resultUserorders[i]["order_status"],
        });
      }
    }
    return res.status(200).json(
      generalResponse("data fetch succesfully", {
        userDetails: resultUserDetails,
        userAddress: resultUserAddress,
        userOrder: resultUserorders,
        productDetails: productDetails,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json("something went wrong");
  }
};

export const updateUserDetail = async (req, res) => {
  try {
    const email = req.body.userInfo.email;

    let data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      contact: req.body.contact,
    };

    const { error } = updateProfileSchema.validate(data);
    if (error) {
      return res.status(410).json(generalResponse(error.details[0].message, false));
    }
    const values = req.body;

    const updateUserDetails = `update user_table set
      first_name = '${values.first_name}',
      last_name = '${values.last_name}',
      mobile_number = '${values.contact}'
      where email = '${email}';`;
    const [resultUpdateUserDetails] = await connection.query(updateUserDetails);
    return res
      .status(200)
      .json(generalResponse("Profile Updated Successfully"));
  } catch (error) {
    console.log("error from updateUserDetail", error);
    res.status(400).json("something went wrong");
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    const userData = await getDataFromToken(token);
    const values = JSON.parse(JSON.stringify(req.body));
    const email = userData.email;
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const previousPassword = values.previous_password;

    if (password != confirmPassword) {
      return res
        .status(400)
        .json(
          generalResponse(
            "password and confirmpassword are different please try again"
          )
        );
    }

    const checkPreviousPassword = `select * from user_table where email = '${email}';`;
    const [checkPreviousPasswordResult] = await connection.query(
      checkPreviousPassword
    );

    const userPassword = checkPreviousPasswordResult[0]["password"];
    const verifyPassword = await verifyHashData(previousPassword, userPassword);

    if (!verifyPassword) {
      return res
        .status(400)
        .json(generalResponse("previous password is invalid"));
    }

    if (previousPassword == confirmPassword) {
      return res
        .status(400)
        .json(generalResponse("Old password and New Password Cannot be same"));
    }

    const hashpassword = await hashData(password);

    const updatePassword = `update user_table set password = '${hashpassword}' where email = '${email}'`;
    const resultUpdatePassword = await connection.query(updatePassword);
    return res
      .status(200)
      .json(generalResponse("Password reseted succesfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json("something went wrong");
  }
};

export const updateAddress = async (req, res) => {
  try {
    let data = {
      address: req.body.address,
      pin_code: req.body.pin_code,
      city: req.body.city,
      state: req.body.state,
    };
    const { error } = userAddressSchema.validate(data);
    if (error) {
      return res.status(410).json(generalResponse(error.details[0].message, false));
    }
    let updatedAddress = req.body;
    let updateAddressQuery = `UPDATE user_address_table SET address = '${updatedAddress.address}',pin_code = '${updatedAddress.pin_code}', city = '${updatedAddress.city}', state = '${updatedAddress.state}',updated_at = CURRENT_TIMESTAMP WHERE address_id = ${updatedAddress.addressId}`;
    let [updateAddressResult] = await connection.query(updateAddressQuery);
    return res
      .status(200)
      .json(generalResponse("Address Updated Successfully", updateAddressResult));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const insertAddress = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    let userId = req.body.userInfo.user_id;
    let { address, pin_code, city, state } = req.body;

    let insertAddressQuery = `INSERT INTO user_address_table(user_id, address, pin_code, city, state, created_at) VALUES (${userId}, '${req.body.address}', '${pin_code}', '${city}', '${state}', CURRENT_TIMESTAMP)`;
    let [insertResult] = await connection.query(insertAddressQuery);
    return res
      .status(200)
      .json(generalResponse("Address Inserted Successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json(generalResponse("Something went wrong"));
  }
};

export const postOrderSummary = async (req, res) => {
  try {
    let productQuery = `SELECT v.vendor_product_id, v.category_id, v.vendor_id, v.product_name, v.stock, v.price, v.available_stock, v.description, v.image_path FROM vendor_product_details AS v  WHERE v.vendor_product_id = ?  AND v.is_active = 1 AND v.is_deleted = 0;`;
    let reviewQuery = `SELECT r.image_path, r.review_rating FROM review_table AS r WHERE r.vendor_product_id = ?;`;
    let [productResult] = await connection.query(productQuery, [req.body.productId]);
    let [reviewDataResult] = await connection.query(reviewQuery, [req.body.productId]);

    let productData = await setOfferPrice(productResult);

    return res.status(200).json(
      generalResponse("Product data fetched successsfully", {
        product: productData,
        reviewData: reviewDataResult,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(400).json(generalResponse(false));
  }
};

export const billMakerforUser = async (req, res) => {

  try {
    const { order_id } = req.body;
    const current_user_id = req.body.userInfo.user_id;

    const [bill_id_result] = await connection.query(
      `SELECT bill_id FROM bill_table WHERE order_id = ${order_id};`
    );

    if (bill_id_result.length === 0) {
      return res.status(404).send("Bill not found");  
    }

    const bill_id = bill_id_result[0].bill_id;

    const [bill_result] = await connection.query(
      `SELECT * FROM bill_table WHERE bill_id = ${bill_id};`
    );

    const {
      user_id,
      product_id,
      product_price,
      order_date,
      vendor_id,
      productName,
      customerName,
      customerAddress,
      productDetails,
      taxRate,
      deliveryCharge,
      vendorName,
      companyName,
      companyAddress,
      vendor_email,
      vendor_company_name,
      vendor_gst_no,
      vendor_address,
      s_gst,
      c_gst,
      bill_status
    } = bill_result[0];

    if (current_user_id != user_id || bill_status != 'complete') {
      return res.status(211).json(generalResponse(false));
    }

    const product_price_original = (100 * +product_price) / (100 + taxRate);
    const tax_amount = +product_price - product_price_original;
    const s_gst_amount = (tax_amount * s_gst) / taxRate;
    const c_gst_amount = (tax_amount * c_gst) / taxRate;

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    doc.pipe(res);

    doc
      .fillColor("black")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`${companyName}`, { align: "center" });
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(`${companyAddress}`, { align: "center" });
    doc.moveDown(2);

    doc
      .fillColor("blue")
      .fontSize(25)
      .text("Tax Invoice", { align: "center" })
      .moveDown();

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Vendor Information:`);
    doc.font("Helvetica").text(`Vendor Company: ${vendor_company_name}`);
    doc.moveDown(0.5);
    doc.text(`Vendor GST: ${vendor_gst_no}`);
    doc.moveDown(0.5);
    doc.text(`Vendor Email: ${vendor_email}`);
    doc.moveDown(0.5);
    doc.text(`Vendor Address: ${vendor_address}`);
    doc.moveDown(2);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("black").moveDown();
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Customer Information:`);
    doc.font("Helvetica").text(`Customer Name: ${customerName}`);
    doc.moveDown(0.5);
    doc.text(`Address: ${customerAddress}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("black").moveDown();

    doc.font("Helvetica-Bold").text(`Product ID: ${product_id}`);
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").text(`Product: ${productName}`);
    doc.moveDown(0.5);
    doc.font("Helvetica").text(`Details: ${productDetails}`);
    doc.moveDown(0.5);
    doc.text(`Price (Excl. Tax): Rs ${product_price_original.toFixed(2)}`);
    doc.moveDown();

    doc
      .font("Helvetica")
      .text(`S-GST Rate: Rs ${s_gst_amount.toFixed(2)} (${s_gst}%)`);
    doc
      .font("Helvetica")
      .text(`C-GST Rate: Rs ${c_gst_amount.toFixed(2)} (${c_gst}%)`);
    doc
      .font("Helvetica")
      .text(`Total GST Rate: Rs ${tax_amount.toFixed(2)} (${taxRate}%)`);
    doc.moveDown(0.5);
    doc.text(`Delivery Charges: Rs ${deliveryCharge.toFixed(2)}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("black").moveDown();

    const total = +product_price + +deliveryCharge;
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total Amount: Rs ${total.toFixed(2)}`, { underline: true });

    const qrCodeUrl = ` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=  Product id : - ${product_id}%0A Product name : - ${productName}%0A Price : - ${product_price_original.toFixed(2)}%0A GST rate : - ${taxRate}%0A Delivery Charges  : - ${deliveryCharge}%0A Total : - ${total}%0ACompany Name : - ${companyName}%0A Vendor Name : - ${vendorName}%0A Vendor Company Name : - ${vendor_company_name}%0AVendor Email : - ${vendor_email}%0A Vendor GST no : - ${vendor_gst_no}%0ACompany Address : - ${companyAddress}`;

    const response = await axios.get(qrCodeUrl, {
      responseType: "arraybuffer",
    });

    const qrCodeImage = Buffer.from(response.data, "binary");

    doc.image(qrCodeImage, { width: 150, align: "center" });

    doc.moveDown(2);
    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating the bill");
  }
};

export const postfaq = async (req, res) => {
  try {
    let faq = `select * from dynamic_data where values_for = "faq" and  is_deleted = "0"`;
    let [faqResult] = await connection.query(faq);
    return res
      .status(200)
      .json(generalResponse("faq fetched", faqResult));
  } catch (error) {
    return res.status(404).json(generalResponse(error.message));
  }
};
export const getfaq = async (req, res) => {
  try {
    res.render('user/faq')
  } catch (error) {
    return res.status(404).json(generalResponse(error.message));
  }
};


export const getAboutUsData = async (req, res) => {
  try {
    let customerNumber = `select count(*) as totalCustomers from user_table ;`;
    let [customerNumberResult] = await connection.query(customerNumber);

    let productSold = `select count(*) as totalProducts from order_details;`
    let [productSoldResult] = await connection.query(productSold);

    let ordersCompleted = `select count(*) as totalOrders from order_details where order_status = 'complete';`
    let [ordersCompletedResult] = await connection.query(ordersCompleted);

    return res.status(200).json(generalResponse(true, { customerNumberResult, productSoldResult, ordersCompletedResult }));

  } catch (error) {
    console.log(error.message);
    return res.status(404).json(generalResponse(error.message));
  }
}