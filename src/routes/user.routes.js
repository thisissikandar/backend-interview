import { Router } from "express";
import { validate } from "../validators/validate.js";
import {
  loginValidator,
  registerValidator,
  userForgotPasswordValidator,
  userResetForgottenPasswordValidator,
} from "../validators/users/users.validator.js";
import {
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  resetForgottenPassword,
  verifyEmail,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(registerValidator(), validate, registerUser);
router.route("/login").post(loginValidator(), validate, loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);

router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
  );


// Secured Routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/profile").get(verifyJWT, getCurrentUser);

export default router;
