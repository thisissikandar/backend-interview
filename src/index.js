import dotenv from "dotenv";
import { httpServer } from "./app.js";
import connectDB from "./db/index.js";
import logger from "./logger/winston.logger.js";

dotenv.config({
  path: "./.env",
});

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    logger.info("⚙️  Server is running on port: " + process.env.PORT);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    logger.error("Mongo db connect error: ", err);
  });
