import dotenv from 'dotenv';
import path from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'dev';

const envPath = {
    dev: path.resolve("./config/.env.dev"),
    prod: path.resolve("./config/.env.prod")
}

dotenv.config({ path: envPath[NODE_ENV] || envPath.dev })

export const DB_URL_ATLAS = process.env.DB_URL_ATLAS;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;