import { NextRequest, NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const TABLE_NAME = "QuoteWire_Main";
  const { slug } = await params;

  try {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `CAT#${slug}`,
        ":sk": "QUOTE#",
      },
    }));

    return NextResponse.json(result.Items || []);
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
