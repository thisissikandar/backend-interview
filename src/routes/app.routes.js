import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import { processImport } from "../controllers/import.controllers.js";
import { importFileValidator } from "../validators/importfile/import.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

router
  .route("/import-xl-csv")
  .post(upload.single("file"), importFileValidator, validate, processImport);

export default router;
