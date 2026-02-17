// logic
import bcrypt from "bcrypt";
import userModel from "../../DB/Models/user.model.js";
import { encrypt } from "../../utils/encrypt.js";
import { JWT_SECRET } from "../../../config/config.service.js";
import jwt from "jsonwebtoken";
import { badRequestResponse, conflictResponse, unauthorizedResponse } from "../../Common/Response.js";

export async function Signup(userData) {
  const { name, email, password, phone, age } = userData;

  if (!email || !password || !phone) {
    badRequestResponse("Email, password, and phone are required");
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    conflictResponse("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedPhone = encrypt(phone);

  const result = await userModel.create({
    name,
    email,
    password: hashedPassword,
    phone: encryptedPhone,
    age,
  });

  return result;
}

export async function Login(loginData) {
  const { email, password } = loginData;

  if (!email || !password) {
    badRequestResponse("Email and password are required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    unauthorizedResponse("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    unauthorizedResponse("Email or Password is incorrect");
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}