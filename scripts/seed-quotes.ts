import { GoogleGenerativeAI } from "@google/generative-ai";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";
import path from "path";
import { CATEGORIES } from "../src/lib/categories";
import * as crypto from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// @ts-ignore
const model = genAI.getGenerativeModel({ model: "gemini-3-flash" }, { apiVersion: "v1" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "QuoteWire_Main";

async function generateQuotes(category: string) {
  const prompt = `Generate 5 unique, profound quotes for the category '${category}' in JSON format. 
  Return ONLY a valid JSON array of objects with the following keys:
  - text: the quote text
  - author: the author name
  - tags: an array of relevant strings (including the category)
  
  Example format:
  [{"text": "...", "author": "...", "tags": ["...", "..."]}]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean JSON if needed (sometimes Gemini adds ```json ... ```)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error(`Error generating quotes for ${category}:`, error);
    return [];
  }
}

async function seed() {
  // Seeding a subset of categories for demonstration
  const categoriesToSeed = CATEGORIES.slice(0, 5); 
  
  for (const category of categoriesToSeed) {
    console.log(`Generating quotes for category: ${category}...`);
    const quotes = await generateQuotes(category);
    
    for (const quote of quotes) {
      const timestamp = Date.now();
      const randomHash = Math.random().toString(36).substring(2, 8);
      const quoteId = `${timestamp}_${randomHash}`;
      
      const item = {
        PK: `CAT#${category}`,
        SK: `QUOTE#${quoteId}`,
        GSI1_PK: `AUTHOR#${quote.author}`,
        text: quote.text,
        author: quote.author,
        tags: quote.tags || [category],
        likes: 0,
        created_at: new Date().toISOString(),
      };

      try {
        await docClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        }));
        console.log(`Saved quote by ${quote.author} in ${category}`);
      } catch (err) {
        console.error(`Error saving quote:`, err);
      }
    }
  }
}

seed().then(() => console.log("Seeding complete!")).catch(console.error);
