//validation for all type of users for accesing the protected routes

import express from "express";
const router = express();

export const demoMiddleware = async (req, res, next) => {
  next();
};

//validation for all type of users for accesing the protected routes
