import { Router, type IRouter } from "express";
import quoteHandler from "../../../../api/quote";

const router: IRouter = Router();

/**
 * Local development uses the same quote implementation as Vercel so validation,
 * Supabase storage, Resend delivery, and WhatsApp preparation cannot diverge.
 */
router.post("/quote", async (req, res, next) => {
  try {
    await quoteHandler(
      req as never,
      res as never,
    );
  } catch (error) {
    next(error);
  }
});

export default router;
