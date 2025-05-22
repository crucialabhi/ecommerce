import jwt from "jsonwebtoken";
import "dotenv/config";
import generalResponse from "../helpers/generalResponse.js";

const secretKey = process.env.JWT_SECRET_TOKEN;

//Create token for Signup user
export const createTokenForSignup = async (user) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      return resolve(token);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

//for validation of the token user
export const validateToken = async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res
      .status(400)
      .json(generalResponse("Please Login to access this page.", false));
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json(generalResponse("Please Login to access this page.", false));
    }
    req.body.userInfo = decoded;
    next();
  });
};
// validate token for vendor on authentication
export const validateVendorToken = async (req, res, next) => {
  const token = req.cookies.vendorToken;
  if (!token) {
    return res
      .status(400)
      .json(generalResponse("your session has been expired"));
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json(generalResponse("your session has been expired"));
    }
    req.body.userInfo = decoded;
    next();
  });
};
// For validation 0f get requests to render the page.
export const validateTokenRedirect = async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.redirect("/auth/login");
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.redirect("/auth/login");
    }
    // req.body.userInfo = decoded;
    next();
  });
};

//for extracting data from token
export const getDataFromToken = async (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
    return error;
  }
};
//create token for dashboard

export const createTokenForDashboard = async (user) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      return resolve(token);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};
export const createTokenForadmin = async (user) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      return resolve(token);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

//create token for dashboard

export const createTokenForVendorVerificationPage = async (vendor) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(vendor, secretKey, { expiresIn: "1h" });
      return resolve(token);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

//for validation of the token for vendor
export const validateTokenForVendor = async (req, res, next) => {
  const token = req.cookies.vendorToken;
  if (!token) {
    return res.redirect("/auth/vendor-login");
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.redirect("/auth/vendor-login");
    }
    req.vendorDetails = decoded;
    next();
  });
};
