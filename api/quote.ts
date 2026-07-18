import app from "../artifacts/api-server/src/app";

// Vercel invokes this Express-compatible handler for POST /api/quote.
// The app keeps Resend credentials and validation logic server-side.
export default app;
