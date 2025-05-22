//login signup verification for all user
import express from 'express';
import { authoriseUserApi, authoriseVendorApi, createOtpForgetPassword, createOtpForgetPasswordVendor, createPasswordPage, createVendorPasswordPage, forgetPasswordPage, forgetPasswordPageVendor, getadminlogin, getCity, getUserLogin, getUserSignup, getVendorLogin, getVendorSignup, otpVerification, otpVerificationPage, postadminlogin, postUserLogin, postUserSingup, postVendorLogin, postVendorSingup, resetPassword, resetPasswordVendor, validateUserDetails, validateVendorDetails, vendorOtpVerification, vendorOtpVerificationPage } from '../controller/auth.controller.js';
import { upload } from '../middleware/multerValidation.js';
import { validateToken, validateVendorToken } from '../middleware/jwtToken.js';

const routes = express();

//--------------------------------------User Side-------------------------------------------

//get user signup ,login ,password,otp verfication page
routes.get('/signup', getUserSignup);
routes.all("/login", getUserLogin);
routes.post('/create-password-page',createPasswordPage)
routes.post('/otp-verification',otpVerificationPage);
routes.get('/forget-password-page',forgetPasswordPage);


//validating the token user using api,otp ,user deatils
routes.post('/authorise-user-api',validateToken,authoriseUserApi)
routes.post('/validate-user-details',upload.none(),validateUserDetails);
routes.post('/otp-verification-submit',upload.none(),otpVerification)
routes.post('/create-otp-forget-password',upload.none(),createOtpForgetPassword)
routes.post('/verify-otp-forget-password',upload.none(),otpVerification)
routes.post('/reset-password',upload.none(),resetPassword)

//Submiting the data to the database while signup and login
routes.post('/post-signup',upload.none(),validateToken,postUserSingup);
routes.post('/post-login',upload.none(), postUserLogin);


//--------------------------------------Vendor Side-------------------------------------------

//get vendor signup ,login ,password,otp verfication page
routes.post('/authorise-vendor-api',validateVendorToken,authoriseVendorApi)
routes.get('/vendor-signup', getVendorSignup);
routes.all('/vendor-login', getVendorLogin);
routes.all('/vendor-create-password-page',createVendorPasswordPage)
routes.post('/vendor-otp-verification',vendorOtpVerificationPage);
routes.post('/getCity',getCity);
routes.get('/forget-password-page-vendor',forgetPasswordPageVendor);

//validating the token user using api,otp ,user deatils
routes.post('/validate-vendor-details',upload.none(),validateVendorDetails)
routes.post('/vendor-otp-verification-submit',upload.none(),vendorOtpVerification)
routes.post('/create-otp-forget-password-vendor',upload.none(),createOtpForgetPasswordVendor)
routes.post('/verify-otp-forget-password-vendor',upload.none(),vendorOtpVerification)
routes.post('/reset-password-vendor',upload.none(),resetPasswordVendor)


//Submiting the data to the database while signup and login
routes.post('/post-vendor-signup',upload.none(),validateVendorToken,postVendorSingup);
routes.post('/post-vendor-login',upload.none(),postVendorLogin);

//--------------------------------------Admin Side-------------------------------------------

//get vendorlogin login page
routes.get('/admin',getadminlogin)

//Submiting the data to the database while  login
routes.post('/admin-login',upload.none(),postadminlogin)


export default routes;