import { NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// Force dynamic to ensure randomness on every request
export const dynamic = 'force-dynamic';

export async function GET() {
  const TABLE_NAME = "QuoteWire_Main";

  try {
    // 1. Get Total Count
    // We scan only the PKs to minimize read costs for the count
    const countResult = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      Select: "COUNT",
      FilterExpression: "begins_with(PK, :cat)",
      ExpressionAttributeValues: {
        ":cat": "CAT#",
      },
    }));

    const totalQuotes = countResult.Count || 0;

    // 2. Get a Random Quote
    // To ensure we can pick ANY quote, we ideally need a random index.
    // For a dataset of ~10k, we can scan all IDs (PK, SK, text, author, tags) reasonably fast.
    // This ensures true uniform randomness.
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "begins_with(PK, :cat)",
      ExpressionAttributeValues: {
        ":cat": "CAT#",
      },
      // ProjectionExpression helps reduce data transfer if the items are huge, 
      // but we need the fields to display.
    }));

    const items = result.Items || [];
    
    if (items.length === 0) {
      return NextResponse.json({ quote: null, total: 0 });
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    const randomQuote = items[randomIndex];

    return NextResponse.json({ 
      quote: randomQuote, 
      total: totalQuotes 
    });

  } catch (error) {
    console.error("Error in random quote API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
