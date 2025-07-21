import { Router } from "express";
import { onboardingController } from "../controllers/onboarding.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();


router.route("/").get(verifyJWT,onboardingController);

export default router;
