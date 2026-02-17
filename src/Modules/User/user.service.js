import { badRequestResponse, conflictResponse, notFoundResponse } from "../../Common/Response.js";
import userModel from "../../DB/Models/user.model.js";
import { encrypt } from "../../utils/encrypt.js";

export async function UpdateUser(userId, updateData) {
  const { email, phone, password, ...rest } = updateData;

  if (password) {
    badRequestResponse("Password update is not allowed");
  }

  const user = await userModel.findById(userId);

  if (!user) {
    notFoundResponse("User not found");
  }

  if (email && email !== user.email) {
    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      conflictResponse("Email already exists");
    }

    user.email = email;
  }

  if (phone) {
    user.phone = encrypt(phone);
  }

  Object.assign(user, rest);

  await user.save();

  const result = user.toObject();
  delete result.password;

  return result;
}

export async function DeleteUser(userId) {
  const user = await userModel.findByIdAndDelete(userId);

  if (!user) {
    notFoundResponse("User not found");
  }

  return;
}

export async function GetUser(userId) {
  const user = await userModel.findById(userId);

  if (!user) {
    notFoundResponse("User not found");
  }

  return user;
}
