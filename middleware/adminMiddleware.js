import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

export const protection = (req, res, next) => {
  const token = req.cookies.AdminToken;
  if (!token) {
    return res.redirect("/auth/admin");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET, (err, decode) => {
      if (err) {
        return res.redirect("/auth/admin");
      } else {
        next();
      }
    });
  } catch (error) {
    return res.redirect("/auth/admin");
  }
};
