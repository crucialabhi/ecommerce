//protect routes for vendor
import express from 'express';
import {
  fetchnotificationsforvendorreaded,
  fetchnotificationsforvendorunreaded,
  getcontacttoadmin,
  getnotifications,
  getInventoryChartData,
  getOrderChartData,
  getProducts,
  getShippingData,
  getVendorDashboard,
  postcontacttoadmin,
  postmarkasread,
  postmarkasreadall,
  showAllProducts,
  addProducts,
  getCategories,
  getSubCategory,
  productsData,
  getProductDetail,
  renderEditProduct,
  postProductDetails,
  editStock,
  showOrderDetails,
  getALlOrderDetails,
  getSales,
  getMonthWiseSalesData,
  getCityWiseSalesData,
  pendingVerification,
  checkVerification,
  getProfilePage,
  getProfileDetails,
  editProfileDetails,
  filterResult,
  returnRequest,
  returnRequestDetails,
  AcceptReturnRequest,
  RejectReturnRequest,
  RenderOrderRequests,
  getOrderRequests,
  acceptOrder,
  rejectOrder,
  returnRequestHistory,
  showTrendingProducts,
  getTotalOrderCount,
  getTotalProducts,
  getTotalRevenue,
  getTotalPendingOrders,
  getSearchedProduct,
  deleteProduct,
  getFirstNineProducts,
  getRemainingProducts,
  getFirstNineRequest,
  getRemainingRequest,
  getNineRequestHIstory,
  getRemainingRequestHistory,
  acceptAllOrder,
  updatePrice,
  logout,
  updateVendorStatusApi
} from "../controller/vendor.controller.js";
import multer from "multer";
import { validateTokenForVendor } from "../middleware/jwtToken.js";
const upload = multer({ dest: "uploads/" });
const routes = express();
// const upload = multer;

// routes to render pages 
routes.all("/dashboard", validateTokenForVendor,getVendorDashboard);
routes.get("/contact-to-admin",validateTokenForVendor, getcontacttoadmin);
routes.get("/notifications",validateTokenForVendor, getnotifications);
routes.get("/getProducts",validateTokenForVendor, getProducts);
routes.get("/showOrderDetailsPage",validateTokenForVendor,showOrderDetails)
routes.get("/getSalesPage",validateTokenForVendor,getSales)
routes.get("/getProfile",validateTokenForVendor,getProfilePage)
routes.get("/getReturnRequestPage",validateTokenForVendor,returnRequest)
routes.get("/addProducts",validateTokenForVendor, addProducts);
routes.post("/pending-verification",validateTokenForVendor, pendingVerification);
routes.get("/orderRequests",validateTokenForVendor, RenderOrderRequests);
routes.get("/editProduct",validateTokenForVendor, renderEditProduct);

//authentication route - to check verification status
routes.get("/check-verification", validateTokenForVendor, checkVerification);
routes.get("/logout",validateTokenForVendor,logout)

//dashboard page routes
routes.get("/getOrderChartData", validateTokenForVendor, getOrderChartData);
routes.get("/getInventoryData", validateTokenForVendor, getInventoryChartData);
routes.get("/getShippingData", validateTokenForVendor, getShippingData);
routes.get("/showTrendingProducts",validateTokenForVendor,showTrendingProducts)
routes.get("/getTotalOrders",validateTokenForVendor,getTotalOrderCount)
routes.get("/getTotalProducts",validateTokenForVendor,getTotalProducts)
routes.get("/getTotalRevenue",validateTokenForVendor,getTotalRevenue)
routes.get("/getTotalPendingOrders",validateTokenForVendor,getTotalPendingOrders)

//product listing page routes
routes.get("/getAllProducts", validateTokenForVendor, showAllProducts);
routes.get("/getEditProductDetails", validateTokenForVendor, getProductDetail);
routes.post("/postEditProductDetails", validateTokenForVendor, postProductDetails);
routes.post("/editStock", validateTokenForVendor, editStock);
routes.post("/updatePrice", validateTokenForVendor, updatePrice);
routes.get("/getSearchedProduct",validateTokenForVendor,getSearchedProduct)
routes.get("/deleteProduct",validateTokenForVendor,deleteProduct)
routes.get("/getFirstNineProducts",validateTokenForVendor,getFirstNineProducts)
routes.post("/getRemainingProducts",validateTokenForVendor,getRemainingProducts)

//order page routes
routes.get("/getALlOrderDetails", validateTokenForVendor, getALlOrderDetails)
routes.get("/filterResult", validateTokenForVendor, filterResult)

//sales page routes
routes.get("/getMonthSalesData", validateTokenForVendor, getMonthWiseSalesData)
routes.get("/getCityWiseSalesData", validateTokenForVendor, getCityWiseSalesData)

//add product page routes
routes.get("/getCategories", validateTokenForVendor, getCategories);
routes.post("/getSubCategory", validateTokenForVendor, getSubCategory);
routes.post("/productsData", validateTokenForVendor, productsData);

//return request routes
routes.get("/returnRequest", validateTokenForVendor, returnRequestDetails)
routes.post("/updateReturnRequestAccept",validateTokenForVendor,upload.none(),AcceptReturnRequest)
routes.post("/updateReturnRequestReject",validateTokenForVendor,upload.none(),RejectReturnRequest)
routes.get("/showReturnRequestHistory",validateTokenForVendor,returnRequestHistory)
routes.get("/getFirstNineRequest",validateTokenForVendor,getFirstNineRequest)
routes.post("/getRemainingRequest",validateTokenForVendor,getRemainingRequest)
routes.get("/getNineRequestHIstory",validateTokenForVendor,getNineRequestHIstory)
routes.post("/getRemainingRequestHistory",validateTokenForVendor,getRemainingRequestHistory)

//order request routes
routes.get("/orderRequests/data", validateTokenForVendor, getOrderRequests);
routes.get("/orderRequests/acceptOrder", validateTokenForVendor, acceptOrder);
routes.get("/orderRequests/acceptAllOrder", validateTokenForVendor, acceptAllOrder);
routes.get("/orderRequests/rejectOrder", validateTokenForVendor, rejectOrder);

//contact admin and notification page routes
routes.post("/contacttoadmin", validateTokenForVendor, upload.none(), postcontacttoadmin);
routes.post("/fetchreadednotification", validateTokenForVendor, fetchnotificationsforvendorreaded);
routes.post("/fetchunreadnotification", validateTokenForVendor, fetchnotificationsforvendorunreaded);
routes.post("/markasread", validateTokenForVendor, upload.none(), postmarkasread);
routes.post("/markallasread", validateTokenForVendor, upload.none(), postmarkasreadall);

//profile page routes
routes.get("/getProfileDetails",validateTokenForVendor,getProfileDetails)
routes.post("/editProfileDetails",validateTokenForVendor,editProfileDetails)
routes.post("/updateVendorStatus",validateTokenForVendor,updateVendorStatusApi)


export default routes;
