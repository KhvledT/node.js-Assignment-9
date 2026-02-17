import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.service.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token", { cause: 401 }));
  }
}