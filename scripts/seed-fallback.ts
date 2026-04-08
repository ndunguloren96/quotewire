import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";
import path from "path";
import { CATEGORIES } from "../src/lib/categories";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "QuoteWire_Main";

const FALLBACK_QUOTES: Record<string, any[]> = {
  "Ability": [
    { "text": "Ability is what you're capable of doing. Motivation determines what you do. Attitude determines how well you do it.", "author": "Lou Holtz", "tags": ["Ability", "Motivation", "Attitude"] },
    { "text": "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", "author": "Albert Schweitzer", "tags": ["Ability", "Success", "Happiness"] }
  ],
  "Acting": [
    { "text": "Act as if what you do makes a difference. It does.", "author": "William James", "tags": ["Acting", "Impact"] },
    { "text": "Life is a stage and we are all actors.", "author": "William Shakespeare", "tags": ["Acting", "Life"] }
  ],
  "Action": [
    { "text": "The path to success is to take massive, determined action.", "author": "Tony Robbins", "tags": ["Action", "Success"] },
    { "text": "Action is the foundational key to all success.", "author": "Pablo Picasso", "tags": ["Action", "Success"] }
  ],
  "Adventure": [
    { "text": "Adventure is worthwhile in itself.", "author": "Amelia Earhart", "tags": ["Adventure", "Life"] },
    { "text": "Only those who will risk going too far can possibly find out how far one can go.", "author": "T.S. Eliot", "tags": ["Adventure", "Risk"] }
  ],
  "Age": [
    { "text": "Age is an issue of mind over matter. If you don't mind, it doesn't matter.", "author": "Mark Twain", "tags": ["Age", "Perspective"] },
    { "text": "The great thing about getting older is that you don't lose all the other ages you've been.", "author": "Madeleine L'Engle", "tags": ["Age", "Life"] }
  ]
};

async function seed() {
  const categoriesToSeed = Object.keys(FALLBACK_QUOTES);
  
  for (const category of categoriesToSeed) {
    console.log(`Seeding fallback quotes for category: ${category}...`);
    const quotes = FALLBACK_QUOTES[category];
    
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
        tags: quote.tags,
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

seed().then(() => console.log("Fallback seeding complete!")).catch(console.error);
