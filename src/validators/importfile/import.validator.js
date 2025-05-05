import { body } from "express-validator";

export const importFileValidator = [
  // Check that a file is present
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    next();
  },
  // Validate mode is present and is an integer between 1 and 5
  body("mode")
    .exists()
    .withMessage("Import mode is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Import mode must be between 1 and 5"),
];
