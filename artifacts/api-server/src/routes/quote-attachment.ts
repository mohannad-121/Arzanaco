import { Router, type IRouter } from "express";
import quoteAttachmentHandler from "../../../../api/quote-attachment";

const router: IRouter = Router();

router.get("/quote-attachment", async (req, res, next) => {
  try {
    await quoteAttachmentHandler(req as never, res as never);
  } catch (error) {
    next(error);
  }
});

export default router;
