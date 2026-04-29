import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import itemsRouter from "./items";
import accommodationsRouter from "./accommodations";
import locationsRouter from "./locations";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(itemsRouter);
router.use(accommodationsRouter);
router.use(locationsRouter);
router.use(dashboardRouter);

export default router;
