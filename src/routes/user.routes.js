import { Router } from "express";
import { validate } from "../validators/validate.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/users/users.validator.js";
import {
  getCurrentUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(registerValidator(), validate, registerUser);

router.route("/login").post(loginValidator(), validate, loginUser);

// Secured Routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getCurrentUser);

export default router;
