import { Router, type IRouter } from "express";
import arzanaAiHandler from "../../../../api/arzana-ai";

const router: IRouter = Router();
router.post("/arzana-ai", async (req, res, next) => {
  try { await arzanaAiHandler(req as never, res as never); } catch (error) { next(error); }
});
export default router;
