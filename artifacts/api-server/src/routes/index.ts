import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRouter from "./quote";
import quoteAttachmentRouter from "./quote-attachment";
import quoteUploadRouter from "./quote-upload";
import arzanaAiRouter from "./arzana-ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRouter);
router.use(quoteAttachmentRouter);
router.use(quoteUploadRouter);
router.use(arzanaAiRouter);

export default router;
