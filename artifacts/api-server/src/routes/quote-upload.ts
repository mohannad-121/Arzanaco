import { Router, type IRouter } from "express";
import quoteUploadHandler from "../../../../api/quote-upload";

const router: IRouter = Router();

router.post("/quote-upload", async (req, res, next) => {
  try {
    await quoteUploadHandler(req as never, res as never);
  } catch (error) {
    next(error);
  }
});

export default router;
