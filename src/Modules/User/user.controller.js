import express from "express";
import { authenticate } from "../../Middlewares/auth.middlewares.js";
import { DeleteUser, GetUser, UpdateUser } from "./user.service.js";
import { successResponse } from "../../Common/Response.js";

const userRouter = express.Router();

userRouter.patch("/patch", authenticate, async (req, res, next) => {
  const result = await UpdateUser(req.userId, req.body);

  successResponse({ res, data: result, message: "User updated successfully" });
});

userRouter.delete("/", authenticate, async (req, res, next) => {
  await DeleteUser(req.userId);
  successResponse({ res, message: "User deleted" });
});

userRouter.get("/", authenticate, async (req, res, next) => {
  const result = await GetUser(req.userId);

  successResponse({
    res,
    data: result,
    message: "User data retrieved successfully",
  });
});

export default userRouter;
