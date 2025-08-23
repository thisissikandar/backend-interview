
import { httpServer } from "./app.js";
import { PORT } from "./config/env.js";
import connectDB from "./db/index.js";
import logger from "./logger/winston.logger.js";



const startServer = () => {
  httpServer.listen(PORT || 8080, () => {
    logger.info("⚙️  Server is running on port: " + PORT);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    logger.error("Mongo db connect error: ", err);
  });
