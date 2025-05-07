import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import { processImport } from "../controllers/import.controllers.js";
import { importFileValidator } from "../validators/importfile/import.validator.js";
import { validate } from "../validators/validate.js";
import Company from "../models/company.model.js";

const router = Router();

router
  .route("/import-xl-csv")
  .post(upload.single("file"), importFileValidator, validate, processImport);


  router.get("/companies", async (req, res) => {
    try {
      const companies = await Company.find({});
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });
export default router;
