import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controllers.js";


const router = Router()

router.route("/").get(getDashboardData);
export default router;