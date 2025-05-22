//protect routes for admin
import express from 'express';
import {  expenseAndProfiteOverView,getTotalAdminRevenue,getRevenueVendorWise,getYearWiseAdminRevenue,getMonthWiseAdminRevenue,managetax, getupdatetax,fetchcatids,postcreatetax,postdeletetax, postupdatetax,fetchtaxespost,dashboardRevenue,monthWiseRevenue,getProfile,vendorSearch,viewProfilAdmin,getCardData,electronicsProductDetails,OdersListing,clothesProductDetails ,productDetails,orderOverView, productOverView, salesOverView, userCityDetails, usersDetails, usersOverView, vendorOverView,dashboardControl, vendorsDetails, ordersDetails, salesDetails, fetchvendorscontroller, fetchvendorcontroller, getpendingverification, getpendingverificationgetdetails, fetchpendingverificationvendors, sendmailonrejection, sendmailonverification, getofferspage, availableProduct,postofferspage, fetchoffers, deleteoffers, fetchoffer, updateoffer, fetchactivevendordata, fetchcatvendordata, fetchdataofelectronicsales, getcreatenotification, postcreatenotification, fetchnotifications, getincomingnotification,fetchnotificationsforadminreaded, fetchnotificationsforadminunreaded, postmarkasread, postmarkasreadall, fetchdataofwearssales, fetchdatacatwise, getvalues, postvalues, fetchvalues, fetchvalue, updatevalue, deletevalue, filtervalues, getshipment, fetchorders, fetchorder, updatestatus, searchorders, usersearch, seachcompany, productsearch, logout } from '../controller/admin.controller.js';
const routes = express();
import { upload } from '../middleware/multerValidation.js';
import { protection } from '../middleware/adminMiddleware.js';

// all get routes for render pages
routes.all('/dashboard',protection, dashboardControl); 
routes.get('/taxmanage',protection,managetax)
routes.get('/vendors',protection, vendorsDetails)
routes.get('/orders',protection, ordersDetails)
routes.get('/sales',protection, salesDetails)
routes.get('/users',protection, usersDetails)
routes.get('/view-profile',protection,viewProfilAdmin)
routes.get('/get-admin-profile',protection, getProfile)
routes.get(`/search-vendor`,protection,vendorSearch)
routes.get('/available-products',protection, availableProduct)
routes.get('/product-details',protection, productDetails)
routes.get('/product-details-electronics',protection, electronicsProductDetails)
routes.get('/product-details-clothes',protection, clothesProductDetails)
routes.get('/order-listing',protection, OdersListing)
routes.get('/totalOrders',protection, getCardData)
routes.get('/orderOverView',protection, orderOverView)
routes.get('/vendorOverView',protection, vendorOverView)
routes.get('/salesOverView',protection, salesOverView)
routes.get('/usersOverView',protection, usersOverView)
routes.get('/productOverView',protection, productOverView)
routes.get('/expenseAndProfiteOverView',protection, expenseAndProfiteOverView);
routes.get('/vendors',protection, vendorsDetails)
routes.get('/orders',protection, ordersDetails)
routes.get('/sales',protection, salesDetails)
routes.get('/pending-verification',protection,getpendingverification)
routes.get('/offers',protection,getofferspage)
routes.get('/userGroupByCity',protection,userCityDetails)
routes.get("/fetchoffer/:id",protection,fetchoffer)
routes.get("/updatetax/:id",protection,getupdatetax)
routes.get('/contacttovendor',protection,getcreatenotification);
routes.get('/notifications',protection,getincomingnotification)
routes.get('/values',protection,getvalues)
routes.get('/shipment',protection,upload.none(),getshipment);
routes.get('/getMonthrevenew', protection, monthWiseRevenue);
routes.get('/get-admin-month-revenew', protection, getMonthWiseAdminRevenue)
routes.get('/get-admin-year-revenew', protection,getYearWiseAdminRevenue)
routes.get('/get-vendor-wise-revenue',protection,getRevenueVendorWise)
routes.get('/get-total-revenue', protection, getTotalAdminRevenue)
routes.all('/revenue',protection, dashboardRevenue); 

// all routes for edit data using params
routes.get('/fetch-vendor-details/:id',protection,fetchvendorcontroller)
routes.get('/company-details/:id',protection, getpendingverificationgetdetails)
routes.get('/fetchvalue/:id',protection,fetchvalue)
routes.get('/updateorder/:id',protection,fetchorder)


// all post routes for post data and fetch data using fetch api
routes.post('/fetch-vendors',protection, fetchvendorscontroller)
routes.post('/get-pending-verifications',protection,fetchpendingverificationvendors)
routes.post('/rejectvarification',protection, sendmailonrejection)
routes.post('/authorize-vendor',protection, sendmailonverification)
routes.post("/offers",protection,upload.none(),postofferspage)
routes.post("/fetchoffers",protection,fetchoffers)
routes.post('/deleteoffers',protection,upload.none(),deleteoffers)
routes.post('/updateoffer',protection,upload.none(),updateoffer)
routes.post("/fetchactivevendordata",protection,upload.none(),fetchactivevendordata)
routes.post('/fetchcatvendordata',protection,upload.none(),fetchcatvendordata)
routes.post('/fetchdataofelectronicsales',protection,upload.none(),fetchdataofelectronicsales)
routes.post('/fetchdataofwearsales',protection,upload.none(),fetchdataofwearssales)
routes.post('/fetchdatacatwise',protection,upload.none(),fetchdatacatwise)
routes.post('/sendnotification',protection,upload.none(),postcreatenotification)
routes.post('/fetchnotifications',protection,upload.none(),fetchnotifications)
routes.post('/notificationsreaded',protection,upload.none(),fetchnotificationsforadminreaded)
routes.post('/notificationsunreaded',protection,upload.none(),fetchnotificationsforadminunreaded)
routes.post('/markasread',protection,upload.none(),postmarkasread)
routes.post('/markallasread',protection,upload.none(),postmarkasreadall)
routes.post('/createvalues',protection,upload.none(),postvalues)
routes.post('/fetchvalues',protection,upload.none(),fetchvalues)
routes.post('/updatevalue',protection,upload.none(),updatevalue)
routes.post('/deletevalue',protection,upload.none(),deletevalue)
routes.post('/filtervalues',protection,upload.none(),filtervalues)
routes.post("/fetchorders",protection,upload.none(),fetchorders)
routes.post('/updatestatus',protection,upload.none(),updatestatus)
routes.post('/searchorders',protection,upload.none(),searchorders)
routes.post('/usersearch',protection,upload.none(),usersearch)
routes.post("/seachcompany",protection,upload.none(),seachcompany)
routes.post('/seachproduct',protection,upload.none(),productsearch)
routes.post("/fetchcatids",protection,upload.none(),fetchcatids)
routes.post("/createtax",protection,upload.none(),postcreatetax)
routes.post("/fetchtaxes",protection,upload.none(),fetchtaxespost)
routes.post("/updatetax",protection,upload.none(),postupdatetax)
routes.post("/deletetax",protection,upload.none(),postdeletetax)
// logout route
routes.get('/logout',protection,logout)

export default routes;
