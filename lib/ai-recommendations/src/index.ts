import { GoogleGenerativeAI } from "@google/generative-ai";

export interface RecommendedProduct {
  name: string;
  reason: string;
  estimatedPrice?: string;
}

/**
 * Gets product recommendations based on the items currently in the user's cart
 * using the Google Gemini API.
 *
 * @param cartItems - Array of product names/descriptions currently in the cart
 * @returns Promise resolving to an array of recommended products
 */
export async function getProductRecommendations(
  cartItems: string[]
): Promise<RecommendedProduct[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please configure it to use AI recommendations."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const cartDescription =
    cartItems.length > 0
      ? `The user currently has these items in their cart: ${cartItems.join(", ")}`
      : "The user's cart is empty.";

  const prompt = `${cartDescription}

Based on these items, please recommend 3-5 complementary products that would go well in a supermarket context. 
Return your response as a valid JSON array with objects containing "name" (product name), "reason" (why it pairs well), and optionally "estimatedPrice" (price estimate). 
Only return the JSON array, no other text.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse the JSON response
  const recommendations: RecommendedProduct[] = JSON.parse(responseText);

  return recommendations;
}
