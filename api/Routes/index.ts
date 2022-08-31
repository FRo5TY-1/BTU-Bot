import { Router } from "express";
import apiRouter from "./api-routes";
import authRouter from "./auth-routes";

const router = Router();

router.use("/api", apiRouter);
router.use("/auth", authRouter);

export default router;
