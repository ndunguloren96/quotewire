import { NextRequest, NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase();

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const TABLE_NAME = "QuoteWire_Main";

  try {
    // Scan with filter for Author or Text
    // Note: In production with millions of items, use OpenSearch or Algolia.
    // For this size, Scan is "okay" but not optimal.
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "contains(pk_lower, :q) OR contains(author_lower, :q) OR contains(text_lower, :q)",
      ExpressionAttributeValues: {
        ":q": query,
      },
    });
    
    // Since we didn't store lowercase versions, we have to scan and filter in memory 
    // OR just scan everything (limit 500) and filter in JS for case-insensitivity if the DB doesn't support it easily without extra attributes.
    // DynamoDB 'contains' is case-sensitive.
    // Strategy: Fetch a batch, filter in JS.
    
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      // We'll scan a reasonable amount to find matches.
      Limit: 2000, 
      FilterExpression: "begins_with(PK, :cat)",
      ExpressionAttributeValues: {
        ":cat": "CAT#",
      },
    }));

    const items = result.Items || [];
    const filtered = items.filter(item => 
      item.text.toLowerCase().includes(query) || 
      item.author.toLowerCase().includes(query)
    ).slice(0, 10); // Return top 10 matches

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
