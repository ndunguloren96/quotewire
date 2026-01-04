import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

async function loadQuotes() {
  const allQuotes: any[] = [];

  // 1. JamesFT (bulk_quotes.json) - keys: quoteText, quoteAuthor
  try {
    const raw = fs.readFileSync("data/bulk_quotes.json", "utf-8");
    const data = JSON.parse(raw);
    data.forEach((q: any) => {
      if (q.quoteText && q.quoteAuthor) {
        allQuotes.push({
          text: q.quoteText,
          author: q.quoteAuthor,
          tags: ["General"], // This dataset lacks tags
        });
      }
    });
  } catch (e) { console.log("Error loading bulk_quotes.json", e); }

  // 2. Nasrul (nasrul_quotes.json) - keys: text, from
  try {
    const raw = fs.readFileSync("data/nasrul_quotes.json", "utf-8");
    const data = JSON.parse(raw);
    data.forEach((q: any) => {
      if (q.text && q.from) {
        allQuotes.push({
          text: q.text,
          author: q.from,
          tags: ["Motivation"],
        });
      }
    });
  } catch (e) { console.log("Error loading nasrul_quotes.json", e); }

  // 3. Ata (ata_quotes.json) - keys: id, text, author
  try {
    const raw = fs.readFileSync("data/ata_quotes.json", "utf-8");
    const data = JSON.parse(raw);
    data.forEach((q: any) => {
      if (q.text && q.author) {
        allQuotes.push({
          text: q.text,
          author: q.author,
          tags: ["Daily"],
        });
      }
    });
  } catch (e) { console.log("Error loading ata_quotes.json", e); }

  console.log(`Loaded ${allQuotes.length} quotes in total.`);
  return allQuotes;
}

async function seed() {
  const quotes = await loadQuotes();
  
  // Chunk into batches of 25
  const chunks = [];
  for (let i = 0; i < quotes.length; i += 25) {
    chunks.push(quotes.slice(i, i + 25));
  }

  console.log(`Processing ${chunks.length} batches...`);

  let processed = 0;
  for (const chunk of chunks) {
    const putRequests = chunk.map((q) => {
      const timestamp = Date.now();
      const randomHash = Math.random().toString(36).substring(2, 8);
      // Ensure unique ID even in tight loop
      const quoteId = `${timestamp}_${randomHash}_${Math.floor(Math.random() * 1000)}`;
      
      return {
        PutRequest: {
          Item: {
            PK: `CAT#${q.tags[0] || "General"}`,
            SK: `QUOTE#${quoteId}`,
            GSI1_PK: `AUTHOR#${q.author}`,
            text: q.text,
            author: q.author,
            tags: q.tags,
            likes: 0,
            created_at: new Date().toISOString(),
          },
        },
      };
    });

    try {
      await docClient.send(new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: putRequests,
        },
      }));
      processed += chunk.length;
      if (processed % 500 === 0) console.log(`Seeded ${processed} quotes...`);
      
      // Throttle slightly to avoid WCU throttle
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error("Error writing batch:", err);
    }
  }
}

seed().then(() => console.log("Bulk seeding complete!")).catch(console.error);
