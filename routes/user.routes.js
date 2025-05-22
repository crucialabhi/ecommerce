import express from "express";
import {
  postfaq,
  getfaq,
  addInCart,
  addInWishlist,
  allReviews,
  cartPage,
  getCategoryData,
  aboutUsPage,
  contactUs,
  cartDataApi,
  checkoutPage,
  fetchAdresssForCheckoutApi,
  homePage,
  productDetail,
  productListngPage,
  shopByCategories,
  singleCategoryProducts,
  singleProductDetail,
  singleProductDetailPage,
  privacyPolicy,
  termsAndConditions,
  wishListData,
  wishlistPage,
  removeItemFromCartApi,
  beforeCheckoutPageQuantityCheckApi,
  postCategoryData,
  removeWishlistItemApi,
  postPlaceOrderData,
  userProfileDetails,
  userDashboard,
  updateUserDetail,
  updateUserPassword,
  updateAddress,
  insertAddress,
  addReview,
  noProduct,
  posttermsAndConditions,
  postprivacypolicy,
  postOrderSummary,
  billMakerforUser,
  billPreview,
  singleOrderRedirect,
  singleOrderDetails,
  refundForm,
  getOrderSummary,
  detailsForRefund,
  submitRefundData,
  logout,
  thankYou,
  addNewAddressFromCheckout,
  checkUserLogin,
  completePaymentPage,
  cancelPaymentPage,
  userAccess,
  productInWishlist,
  getAboutUsData,
  deletAddress,
} from "../controller/user.controller.js";
import {
  validateToken,
  validateTokenRedirect,
} from "../middleware/jwtToken.js";
import { upload } from "../middleware/multerValidation.js";
import { stripeImplementation } from "../middleware/stripeImplementation.js";
import { get } from "http";

const routes = express.Router();

//--------------------------------------Get Routes----------------------------------------------

//Get all the Static pages routes
routes.all("/", homePage);

routes.get("/cart", validateTokenRedirect, cartPage);

routes.get("/shop", productListngPage);

routes.get("/single-product-detail", singleProductDetailPage);

routes.get("/shopByCategory", shopByCategories);

routes.get("/noProduct", noProduct);

routes.get("/orderSummary", validateTokenRedirect, getOrderSummary);

routes.get("/aboutUs", aboutUsPage);

routes.get("/contactUs", contactUs);

routes.get("/privacyPolicy", privacyPolicy);

routes.get("/checkout", validateTokenRedirect, checkoutPage);

routes.get("/wishlist", validateTokenRedirect, wishlistPage);

routes.get("/termsAndConditions", termsAndConditions);

routes.get("/user-profile-page", userProfileDetails);

routes.get("/refundForm", validateTokenRedirect, refundForm);

routes.get('/thankyou', validateTokenRedirect, thankYou);

routes.get('/completePaymentPage', validateTokenRedirect, completePaymentPage)

routes.get('/cancelPaymentPage', validateTokenRedirect, cancelPaymentPage)
routes.get("/faq", getfaq);

//--------------------------------------API Routes----------------------------------------------

//All the API
routes.get("/get-single-product-detail", singleProductDetail);

routes.post("/getReviews", allReviews);

routes.post("/getData", productDetail);

routes.post("/addInWishlist", validateToken, addInWishlist);

routes.post("/addInCart", validateToken, addInCart);

routes.get("/getCategoryData", getCategoryData);

routes.get("/getCategoryProducts", singleCategoryProducts);

routes.post("/privacypolicy", postprivacypolicy);

routes.post("/termsAndConditions", posttermsAndConditions);

routes.post("/postCategoryData", postCategoryData);

routes.post("/submitReview", upload.array("img"),validateToken, addReview);

routes.get("/checkUserAccess", validateToken, userAccess);

routes.post("/productInWishlist", validateToken, productInWishlist);

routes.get("/productInWishlist", validateToken, productInWishlist);

routes.get("/billPreview", billPreview);

routes.post("/postOrderSummary", postOrderSummary);

routes.get("/fetchAdresssForCheckout", validateToken, fetchAdresssForCheckoutApi);

routes.get("/fetchCartData", validateToken, cartDataApi);

routes.get("/fetchWishlistData", validateToken, wishListData);

routes.post("/removeItemFromCartApi", validateToken, removeItemFromCartApi);

routes.post("/beforeCheckoutPageQuantityCheckApi", beforeCheckoutPageQuantityCheckApi);

routes.post("/billMakerforUser", validateToken, billMakerforUser); // this api send bill pdf to user

routes.post("/checkUserLogin", validateToken, checkUserLogin);

// This api send bill pdf to user
routes.post("/removeWishlistItemApi", removeWishlistItemApi);

routes.post("/postPlaceOrderData", validateToken, postPlaceOrderData);

//my account
routes.get("/user-profile-page", validateToken, userProfileDetails);
routes.post("/dashboard", validateToken, userDashboard);
routes.post("/update-user-detail", upload.none(), validateToken, updateUserDetail);
routes.post("/update-user-password", upload.none(), validateToken, updateUserPassword);
routes.post("/update-address", upload.none(), validateToken, updateAddress);

routes.get("/singleOrderRedirect", validateToken, singleOrderRedirect);
routes.post("/singleOrderDetails", validateToken, singleOrderDetails);
routes.get("/refundForm", validateToken, refundForm);
routes.post("/detailsForRefund", validateToken, detailsForRefund);
routes.post("/submitRefundData", validateToken, submitRefundData);

routes.post('/addNewAddressFromCheckout', upload.none(), validateToken, addNewAddressFromCheckout)

routes.get('/getAboutUsData', getAboutUsData)

routes.post('/deleteAddress', deletAddress)


//my account
routes.get("/user-profile-page", validateToken, userProfileDetails);
routes.post("/dashboard", validateToken, userDashboard);
routes.post("/update-user-detail", upload.none(), validateToken, updateUserDetail);
routes.post("/update-user-password", upload.none(), validateToken, updateUserPassword);
routes.post("/update-address", upload.none(), validateToken, updateAddress);
routes.post("/insert-address", validateToken, insertAddress);
routes.post("/faq", validateToken, postfaq)

export default routes;
