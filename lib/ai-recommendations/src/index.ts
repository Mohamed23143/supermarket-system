import { GoogleGenerativeAI } from "@google/generative-ai";

export interface RecommendedProduct {
  name: string;
  reason: string;
  estimatedPrice?: string;
}

/**
 * Gets product recommendations based on the items currently in the user's cart
 * using the Google Gemini API. Falls back to mock recommendations if API quota is exceeded.
 *
 * @param cartItems - Array of product names/descriptions currently in the cart
 * @returns Promise resolving to an array of recommended products
 */
export async function getProductRecommendations(
  cartItems: string[]
): Promise<RecommendedProduct[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return mock recommendations if no API key
    return getMockRecommendations(cartItems);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fall back to mock recommendations if API fails
    return getMockRecommendations(cartItems);
  }
}

/**
 * Returns mock product recommendations when API is unavailable
 */
function getMockRecommendations(cartItems: string[]): RecommendedProduct[] {
  const allRecommendations: { [key: string]: RecommendedProduct[] } = {
    milk: [
      {
        name: "Cereal",
        reason: "Perfect breakfast pair with milk",
        estimatedPrice: "$3.99",
      },
      {
        name: "Cookies",
        reason: "Great snack to go with milk",
        estimatedPrice: "$2.49",
      },
    ],
    bread: [
      {
        name: "Butter",
        reason: "Essential spread for bread",
        estimatedPrice: "$4.99",
      },
      {
        name: "Jam",
        reason: "Delicious breakfast topping",
        estimatedPrice: "$3.49",
      },
      {
        name: "Cheese",
        reason: "Perfect for sandwiches",
        estimatedPrice: "$5.99",
      },
    ],
    eggs: [
      {
        name: "Bacon",
        reason: "Classic breakfast combination",
        estimatedPrice: "$6.99",
      },
      {
        name: "Cheese",
        reason: "Great for omelets",
        estimatedPrice: "$5.99",
      },
    ],
  };

  const recommendations: RecommendedProduct[] = [];
  const seen = new Set<string>();

  cartItems.forEach((item) => {
    const lowerItem = item.toLowerCase();
    const itemRecommendations = allRecommendations[lowerItem] || [];

    itemRecommendations.forEach((rec) => {
      if (!seen.has(rec.name)) {
        recommendations.push(rec);
        seen.add(rec.name);
      }
    });
  });

  // Add general recommendations if cart is empty or no specific ones found
  if (recommendations.length === 0) {
    return [
      {
        name: "Fresh Vegetables",
        reason: "Essential for a balanced diet",
        estimatedPrice: "$3.99",
      },
      {
        name: "Fruits",
        reason: "Healthy snack option",
        estimatedPrice: "$4.99",
      },
      {
        name: "Yogurt",
        reason: "Great source of probiotics",
        estimatedPrice: "$2.99",
      },
    ];
  }

  return recommendations;
}
