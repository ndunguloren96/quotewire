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
      UpdateExpression: "SET #v = if_not_exists(#v, :zero) + :inc",
      ExpressionAttributeNames: {
        "#v": "views"
      },
      ExpressionAttributeValues: {
        ":zero": 0,
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    }));

    return NextResponse.json({ views: result.Attributes?.views });
  } catch (error) {
    console.error("Error logging view:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
