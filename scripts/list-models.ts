import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function list() {
  const models = await genAI.getGenerativeModel({ model: "gemini-pro" }); // placeholder
  // Actually the SDK doesn't have a direct listModels on the genAI instance sometimes depending on version?
  // Let's try the REST API directly or check SDK docs.
  // In the latest SDK, it might be different.
  
  // Try calling it and see what happens
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("test");
    console.log("gemini-pro works");
  } catch (e) {
    console.log("gemini-pro fails");
  }
}

list();
