import connection from "../database/connection.js";
import { generateSelect } from "../helpers/createSelectBox.js";
import generalResponse from "../helpers/generalResponse.js";
import { hashData, verifyHashData } from "../middleware/bcrypt.js";
import { createCookie } from "../middleware/createCookies.js";
import {
  validateLogin,
  validateUserInJoi,
  validateVendorInJoi,
} from "../middleware/joiValidation.js";
import {
  createTokenForadmin,
  createTokenForDashboard,
  createTokenForSignup,
  createTokenForVendorVerificationPage,
  getDataFromToken,
} from "../middleware/jwtToken.js";
import { generateOTP, sendMail } from "../middleware/nodeMailer.js";

//----------------------------------------- User Auth routes-----------------------------------------//

//  route for getting the signup page
export const getUserSignup = (req, res) => {
  res.render("user/signup");
};

//  route for getting the Login page
export const getUserLogin = (req, res) => {
  res.render("user/login");
};

//route for getting the otp verification  page
export const otpVerificationPage = async (req, res) => {
  res.render("user/otpVerification");
};

//route for getting the create password  page
export const createPasswordPage = async (req, res) => {
  res.render("user/createPasswordPage");
};

// Route for getting forget password
export const forgetPasswordPage = async (req, res) => {
  res.render("user/forgetPasswordPage");
};

//validating user details while signup and storing it in jwt token
export const validateUserDetails = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const mail = values.email;

    //Validate User using joi
    const validation =  validateUserInJoi(values);
    console.log(validation);
    if (validation.error) {
      const messageOfEroor = validation.error.details[0]["message"];
      return res.status(400).json(generalResponse(messageOfEroor));
    }

    //validating that email is unique or not
    const checkingEmailIsUnique = `select * from user_table where email = '${mail}'`;
    const [resultOfEmail] = await connection.query(checkingEmailIsUnique);
    if (resultOfEmail.length != 0) {
      return res.status(400).json(generalResponse("User Exist"));
    }

    //Creating JWT token for signup
    const tokenOfUser = await createTokenForSignup(values);

    //create Otp
    const OTP = generateOTP();
    console.log(OTP);

    const hashOTP = await hashData(OTP);

    //send Mail
    const mailMessage = await sendMail(mail, OTP);

    //data to send in front end
    const dataToSend = {
      mailMessage: mailMessage,
    };

    //creating Cookie
     createCookie(res, "userToken", tokenOfUser);
     createCookie(res, "userOtp", hashOTP);

    //send response
    return res.status(200).json(generalResponse("Success", dataToSend));
  } catch (error) {
    console.log("Error from validateUserDetails", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

//validating otp verficication
export const otpVerification = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const otp = values.otp;

    //hash Otp from the cookies
    const otpToken = req.cookies.userOtp;
    
    console.log(otp, otpToken);

    //verifying Otp using bcrypt
    const verifyOTP = await verifyHashData(otp, otpToken);

    if (!verifyOTP) {
      //the user has not verfied and the response is send
      return res.status(401).json(generalResponse("Your Otp is Invalid"));
    }

    //the user has verfied and the response is send
    return res.status(200).json(generalResponse("Your Otp is Valid"));
  } catch (error) {
    console.log("Error from otpVerification", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

//Authorising the user is it validate for the password page
export const authoriseUserApi = async (req, res) => {
  try {
    return res.status(200).json(generalResponse("Authorise user"));
  } catch (error) {
    console.log("Error from authoriseUserApi", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};
export const authoriseVendorApi = async (req, res) => {
  try {
    return res.status(200).json(generalResponse("Authorise user"));
  } catch (error) {
    console.log("Error from authoriseUserApi", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

//inserting the data in the user_table
export const postUserSingup = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const token = req.cookies.userToken;
    const password = values.password;
    const confirmPassword = values.confirmPassword;

    if (password != confirmPassword) {
      return res.status(400).json(generalResponse("Confirm password not matched please try again!"));
    }

    const hashpassword = await hashData(password);
    const userData = await getDataFromToken(token);

    const insertUserDataQuery = `insert into user_table 
      (first_name,last_name,mobile_number,email,password) values(
      '${userData.first_name}','${userData.last_name}','${userData.contact}','${userData.email}','${hashpassword}')`;
    const [insertUserDataResult] = await connection.query(insertUserDataQuery);

    res.clearCookie("userOtp");
    return res.status(200).json(generalResponse("You have successfully created your account"));
  } catch (error) {
    console.log("Error from postUserSingup", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

//checking the user  Creditinals are valid or not
export const postUserLogin = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const joiValidationInLogin = await validateLogin(values);

    if (joiValidationInLogin.error) {
      return res.status(400).json(generalResponse("all fields are required"));
    }

    const email = values.email;
    const password = values.password;

    const getUserDetailsQuery = `select * from user_table where email = '${email}'`;
    const [getUserDetailsResult] = await connection.query(getUserDetailsQuery);

    if (getUserDetailsResult.length == 0) {
      return res.status(400).json(generalResponse("Creditinal Invalid"));
    }

    const userData = {
      user_id: getUserDetailsResult[0]["user_id"],
      email: getUserDetailsResult[0]["email"],
    };

    const hashPassword = getUserDetailsResult[0]["password"];
    const verifyPassword = await verifyHashData(password, hashPassword);

    if (!verifyPassword) {
      return res.status(400).json(generalResponse("Creditinals Invalid"));
    }

    const token = await createTokenForDashboard(userData);
     createCookie(res, "userToken", token);
    return res.status(200).json(generalResponse("Successfully Logged In",true));
  } catch (error) {
    console.log("Error from postUserLogin", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

// Create otp for forget password 
export const createOtpForgetPassword = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const mail = values.email;
    
    
    //Validating email is there or not
    if (!mail) return res.status(400).json(generalResponse("Email cannot be empty"));

    //validating that email is valid or not
    const checkingEmailIsValid = `select * from user_table where email = '${mail}'`;
    const [resultOfEmail] = await connection.query(checkingEmailIsValid);

    if (resultOfEmail.length == 0) {
      return res.status(400).json(generalResponse("User doesn't Exist"));
    }

    //creating token
    const tokenOfUser = await createTokenForSignup(values);
    //create Otp
    const OTP = generateOTP();
    console.log(OTP);

    const hashOTP = await hashData(OTP);

    //send Mail
    const mailMessage = await sendMail(mail, OTP);

    //creating Cookie
     createCookie(res, "userOtp", hashOTP);
     createCookie(res, "userEmail", tokenOfUser);
    //send response
    return res.status(200).json(generalResponse("Success", mailMessage));
  } catch (error) {
    console.log("Error from forget password", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const emailToken = req.cookies.userEmail;
    const tokenData = await getDataFromToken(emailToken);
    const email = tokenData.email;

    if (password != confirmPassword) {
      return res.status(400).json("password and confirmPassword should be same!");
    }

    const hashpassword = await hashData(password);
    const resetPassword = `update user_table set password = '${hashpassword}' where email = '${email}'`;
    const [resultResetPassword] = await connection.query(resetPassword);
    return res.status(200).json(generalResponse("paswword set successfully"));
  } catch (error) {
    console.log("Error from reset password", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

// Vendor auth routes
// Vendor get routes
export const getVendorSignup = async (req, res) => {
  const queryForState = `select * from states where country_id =101;`;
  const [resultForState] = await connection.query(queryForState);
  const stateSelectBox = generateSelect(`State`, resultForState);
  res.render("vendor/signup", { stateSelectBox: stateSelectBox });
};

// Example route for getting the Login page
export const getVendorLogin = (req, res) => {
  res.render("vendor/login");
};

export const createVendorPasswordPage = (req, res) => {
  res.render("vendor/createPasswordPage");
};

export const vendorOtpVerificationPage = (req, res) => {
  res.render("vendor/otpVerification");
};

export const forgetPasswordPageVendor = async (req, res) => {
  res.render("vendor/forgetPasswordPage");
};

// Vendor fetch data routes
export const getCity = async (req, res) => {
  try {
    const id = req.body.id;

    const selectStates = `select * from cities where state_id = ${id}`;
    const [statesResult] = await connection.query(selectStates);

    let stateString = generateSelect("City", statesResult);

    return res.status(200).send(generalResponse("successfully get the data", stateString));
  } catch (error) {
    console.log("Error from getcity", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const validateVendorDetails = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const mail = values.email;

    //Validate User using joi
    const validation = await validateVendorInJoi(values);
    if (validation.error) {
      const messageOfEroor = validation.error.details[0]["message"];
      return res.status(400).json(generalResponse(messageOfEroor));
    }

    //  validating that email is unique or not
    const checkingEmailIsUnique = `select * from vendor_details where email = '${mail}'`;
    const [resultOfEmail] = await connection.query(checkingEmailIsUnique);
    if (resultOfEmail.length != 0) {
      return res.status(400).json(generalResponse("User Exist"));
    }

    //Creating JWT token for signup
    const tokenOfUser = await createTokenForSignup(values);

    //create Otp
    const OTP = generateOTP();
    console.log(OTP);
    const hashOTP = await hashData(OTP);

    //send Mail
    const mailMessage = await sendMail(mail, OTP);

    //create cookies
    createCookie(res, "vendorToken", tokenOfUser);
    createCookie(res, "vendorOtp", hashOTP);

    //data to send in front end
    const dataToSend = {
      mailMessage: mailMessage,
    };
    //send response
    return res.status(200).json(generalResponse("Success", dataToSend));
  } catch (error) {
    console.log("Error from validate vendor details ", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const vendorOtpVerification = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const otp = values.otp;

    //hash Otp from the localstorage
    const otpToken = req.cookies.vendorOtp;

    //verifying Otp using bcrypt
    const verifyOTP = await verifyHashData(otp, otpToken);

    if (!verifyOTP) {
      //the user has not verfied and the response is send
      return res.status(401).json(generalResponse("Your Otp is Invalid"));
    }

    //the user has verfied and the response is send
    return res.status(200).json(generalResponse("Your Otp is Valid"));
  } catch (error) {
    console.log("Error from otpVerification", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const postVendorSingup = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const token = req.cookies.vendorToken;

    const password = values.password;
    const confirmPassword = values.confirmPassword;

    if (password != confirmPassword) {
      return res.status(400).json(generalResponse("password and confirmpassword are different please try again"));
    }

    const hashpassword = await hashData(password);
    const userData = await getDataFromToken(token);
    const insertUserData = `insert into  vendor_details                                               
      (first_name,last_name,email,mobile_number,company_name,gst_number,pincode,city,state,cat_id,password)
      values('${userData.first_name}','${userData.last_name}','${userData.email}','${userData.contact}','${userData.company_name}',
      '${userData.gst_number}','${userData.pincode}','${userData.State}','${userData.City}','${userData.category}','${hashpassword}')`;
    const [postVendorSingupResult] = await connection.query(insertUserData);

    return res.status(200).json(generalResponse("You have successfully created your account vendor"));
  } catch (error) {
    console.log("Error from postUserSingup", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const postVendorLogin = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const joiValidationInLogin = await validateLogin(values);

    if (joiValidationInLogin.error) {
      return res.status(400).json(generalResponse("all fields are required"));
    }

    const email = values.email;
    const password = values.password;
    const getDetails = `select * from vendor_details where email = '${email}'`;

    const [postVendorLoginReault] = await connection.query(getDetails);
    if (postVendorLoginReault.length == 0) {
      return res.status(400).json(generalResponse("Creditinal Invalid"));
    }
    const hashPassword = postVendorLoginReault[0]["password"];
    const verifyPassword = await verifyHashData(password, hashPassword);

    if (!verifyPassword) {
      return res.status(400).json(generalResponse("Creditinal Invalid"));
    }

    let vendor = {
      vendor_id: postVendorLoginReault[0].vendor_id,
      email: postVendorLoginReault[0].email
    }
    const token = await createTokenForVendorVerificationPage(vendor);
    createCookie(res, "vendorToken", token);
   
    return res.status(200).json(generalResponse("Successfully Logged"));
  } catch (error) {
    console.log("Error from postUserLogin", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

export const createOtpForgetPasswordVendor = async(req,res)=>{
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const mail = values.email;

    //Validating email is there or not
    if (!mail) return res.status(400).json(generalResponse("Email cannot be empty"));

    //validating that email is valid or not
    const checkingEmailIsValid = `select * from vendor_details where email = '${mail}'`;
    const [resultOfEmail] = await connection.query(checkingEmailIsValid);

    if (resultOfEmail.length == 0) {
      return res.status(400).json(generalResponse("User doesn't Exist"));
    }

    //creating token
    const tokenOfUser = await createTokenForSignup(values);
    //create Otp
    const OTP = generateOTP();
    console.log(OTP);

    const hashOTP = await hashData(OTP);

    //send Mail
    const mailMessage = await sendMail(mail, OTP);

    //creating Cookie
     createCookie(res, "userOtp", hashOTP);
     createCookie(res, "userEmail", tokenOfUser);
    //send response
    return res.status(200).json(generalResponse("Success", mailMessage));
  } catch (error) {
    console.log("Error from forget password", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
}

export const resetPasswordVendor = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const emailToken = req.cookies.userEmail;
    const tokenData = await getDataFromToken(emailToken);
    const email = tokenData.email;

    if (password != confirmPassword) {
      return res.status(400).json("password and confirmPassword should be same!");
    }

    const hashpassword = await hashData(password);
    const resetPassword = `update vendor_details set password = '${hashpassword}' where email = '${email}'`;
    const [resultResetPassword] = await connection.query(resetPassword);
    
    return res.status(200).json(generalResponse("paswword set successfully"));
  } catch (error) {
    console.log("Error from reset password", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};

// Admin auth routes
// admin auth get routes
export const getadminlogin = async (req, res) => {
  res.render("admin/adminlogin");
};

export const postadminlogin = async (req, res) => {
  try {
    const values = JSON.parse(JSON.stringify(req.body));
    const joiValidationInLogin = await validateLogin(values);
    const email = values.email;
    const password = values.password;

    const getAdminDetailsQuery = `select * from admin_table where email = '${email}'`;
    const [getAdminDetailsResult] = await connection.query(getAdminDetailsQuery);

    if (joiValidationInLogin.error) {
      return res.status(400).json(generalResponse("all fields are required"));
    }

    if (getAdminDetailsResult.length == 0) {
      return res.status(400).json(generalResponse("Creditinal Invalid"));
    }
    const hashPassword = getAdminDetailsResult[0]["password"];
    const verifyPassword = await verifyHashData(password, hashPassword);

    if (!verifyPassword) {
      return res.status(400).json(generalResponse("Creditinal Invalid"));
    }

    const token = await createTokenForadmin(getAdminDetailsResult[0]);
    createCookie(res, "AdminToken", token);

    res.status(200).json(generalResponse("login successfully"));
  } catch (error) {
    console.log("Error from postUserLogin", error);
    res.status(400).json(generalResponse("Something Went Wrong"));
  }
};
