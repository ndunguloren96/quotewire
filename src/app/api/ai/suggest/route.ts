import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { liked_quotes, preferred_categories } = await request.json();

    const prompt = `Based on these user preferences, return 5 recommended profound quotes.
    Liked quotes: ${JSON.stringify(liked_quotes)}
    Preferred categories: ${JSON.stringify(preferred_categories)}
    
    Return ONLY a JSON array of objects with keys 'text', 'author', 'tags'.`;

    // Try multiple model names for 2026 compatibility
    const models = ["gemini-3-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let responseText = "";
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        if (responseText) break;
      } catch (e) {
        console.warn(`Failed with model ${modelName}, trying next...`);
      }
    }

    if (!responseText) {
      // Fallback if AI fails
      return NextResponse.json([
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", tags: ["Hope", "Future"] }
      ]);
    }

    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("Error in AI suggest:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
