import { NextRequest, NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const TABLE_NAME = "QuoteWire_Main";
  const { slug } = await params;
  // slug will be the author name, potentially URL encoded

  try {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "AuthorIndex",
      KeyConditionExpression: "GSI1_PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `AUTHOR#${decodeURIComponent(slug)}`,
      },
    }));

    return NextResponse.json(result.Items || []);
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
