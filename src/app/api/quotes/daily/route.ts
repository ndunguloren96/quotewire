import { NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  const TABLE_NAME = "QuoteWire_Main";
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    const dailyResult = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: "DAILY#QUOTE",
        SK: `DATE#${today}`,
      },
    }));

    if (dailyResult.Item) {
      return NextResponse.json(dailyResult.Item);
    }

    const allResult = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "begins_with(PK, :cat)",
      ExpressionAttributeValues: {
        ":cat": "CAT#",
      },
    }));

    if (!allResult.Items || allResult.Items.length === 0) {
      return NextResponse.json({ error: "No quotes available to pick daily" }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * allResult.Items.length);
    const selectedQuote = allResult.Items[randomIndex];

    const dailyQuote = {
      PK: "DAILY#QUOTE",
      SK: `DATE#${today}`,
      text: selectedQuote.text,
      author: selectedQuote.author,
      tags: selectedQuote.tags,
      original_pk: selectedQuote.PK,
      original_sk: selectedQuote.SK,
      date_active: today,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: dailyQuote,
    }));

    return NextResponse.json(dailyQuote);
  } catch (error) {
    console.error("Error in daily quote engine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
