import express, { Request, Response } from "express";
import { getProductRecommendations } from "@supermarket/ai-recommendations";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Recommendations endpoint
app.post(
  "/recommendations",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cartItems } = req.body as { cartItems: string[] };

      // Validate input
      if (!Array.isArray(cartItems)) {
        res.status(400).json({
          error: "Invalid request body. Expected { cartItems: string[] }",
        });
        return;
      }

      // Get recommendations from AI
      const recommendations = await getProductRecommendations(cartItems);

      res.json({
        success: true,
        recommendations,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log(`  GET  /health`);
  console.log(`  POST /recommendations`);
});
