// API
import express from "express";
import { Login, Signup } from "./auth.service.js";
import { successResponse } from "../../Common/Response.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  await Signup(req.body);
  successResponse({res, message: "Signup successful", statusCode: 201});
});

authRouter.post("/login", async (req, res) => {
  const token = await Login(req.body);
  successResponse({res, data: {token}, message: "Login successful"});    
});

export default authRouter;
