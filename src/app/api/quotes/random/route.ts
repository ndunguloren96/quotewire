import { NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  const TABLE_NAME = "QuoteWire_Main";

  try {
    // For small datasets, Scan is okay. In production, use a more efficient random selection.
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 50, // Just get some
    }));

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json({ error: "No quotes found" }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * result.Items.length);
    const quote = result.Items[randomIndex];

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
