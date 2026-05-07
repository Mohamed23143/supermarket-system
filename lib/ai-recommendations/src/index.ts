import Anthropic from "@anthropic-ai/sdk";

export interface RecommendedProduct {
  name: string;
  reason: string;
  estimatedPrice?: string;
}

/**
 * Gets product recommendations based on the items currently in the user's cart
 * using the Anthropic Claude API.
 *
 * @param cartItems - Array of product names/descriptions currently in the cart
 * @returns Promise resolving to an array of recommended products
 */
export async function getProductRecommendations(
  cartItems: string[]
): Promise<RecommendedProduct[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is not set. Please configure it to use AI recommendations."
    );
  }

  const client = new Anthropic({ apiKey });

  const cartDescription =
    cartItems.length > 0
      ? `The user currently has these items in their cart: ${cartItems.join(", ")}`
      : "The user's cart is empty.";

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${cartDescription}

Based on these items, please recommend 3-5 complementary products that would go well in a supermarket context. 
Return your response as a valid JSON array with objects containing "name" (product name), "reason" (why it pairs well), and optionally "estimatedPrice" (price estimate). 
Only return the JSON array, no other text.`,
      },
    ],
  });

  // Extract the text content from the response
  const responseText = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  // Parse the JSON response
  const recommendations: RecommendedProduct[] = JSON.parse(responseText);

  return recommendations;
}
