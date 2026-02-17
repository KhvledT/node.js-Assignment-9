// Database connection logic
import { connect } from "mongoose";
import { DB_URL_ATLAS } from "../../config/config.service.js";

export async function DB_Connection() {
  try {
    await connect(DB_URL_ATLAS);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
