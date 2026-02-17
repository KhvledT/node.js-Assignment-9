// utils/encrypt.js
import crypto from "crypto";
import { ENCRYPTION_KEY } from "../../config/config.service.js";

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha256")
  .update(ENCRYPTION_KEY)
  .digest()
  .subarray(0, 32);

export function encrypt(text) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}