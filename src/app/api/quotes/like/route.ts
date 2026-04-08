import { NextRequest, NextResponse } from "next/server";
import { docClient } from "@/lib/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request: NextRequest) {
  const TABLE_NAME = "QuoteWire_Main";
  
  try {
    const { pk, sk } = await request.json();

    if (!pk || !sk) {
      return NextResponse.json({ error: "Missing PK or SK" }, { status: 400 });
    }

    const result = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: "SET likes = if_not_exists(likes, :zero) + :inc",
      ExpressionAttributeValues: {
        ":zero": 0,
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    }));

    return NextResponse.json({ likes: result.Attributes?.likes });
  } catch (error) {
    console.error("Error liking quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
