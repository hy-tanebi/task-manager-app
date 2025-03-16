import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  const { userId, message } = await req.json();

  if (!userId || !message) {
    return NextResponse.json(
      { error: "Missing userId or message" },
      { status: 400 }
    );
  }

  // データベースから Slackの access_token を取得
  const slackAuth = await prisma.slackAuth.findUnique({
    where: { slackUserId: userId },
  });

  if (!slackAuth || !slackAuth.accessToken) {
    return NextResponse.json(
      { error: "Slack access token not found" },
      { status: 404 }
    );
  }

  try {
    // Slack API にメッセージを送る
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: userId, // ユーザーのDMに送る
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${slackAuth.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.ok) {
      return NextResponse.json(
        { error: `Slack API Error: ${response.data.error}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Slack notification sent successfully",
    });
  } catch (error) {
    console.error("Slack Notification Error:", error);
    return NextResponse.json(
      { error: "Failed to send Slack notification" },
      { status: 500 }
    );
  }
}
