import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRouter from "./quote";
import arzanaAiRouter from "./arzana-ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRouter);
router.use(arzanaAiRouter);

export default router;
