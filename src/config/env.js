import { config } from "dotenv";

config();

export const {
  PORT,
  CORS_ORIGIN,
  NODE_ENV,
  MONGODB_URI,
  REFRESH_TOCKEN_SECRET,
  REFRESH_TOCKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
} = process.env;