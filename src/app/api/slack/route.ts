import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

const SLACK_CLIENT_ID = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET;
const SLACK_REDIRECT_URI = process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state"); // ✅ SupabaseのuserIdを取得

  if (!code || !userId) {
    console.error("Missing authorization code or userId", { code, userId });
    return NextResponse.json(
      { error: "Missing authorization code or userId" },
      { status: 400 }
    );
  }

  try {
    console.log("OAuth Request Params:", {
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      redirect_uri: SLACK_REDIRECT_URI,
      code,
    });

    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          client_id: SLACK_CLIENT_ID,
          client_secret: SLACK_CLIENT_SECRET,
          code,
          redirect_uri: SLACK_REDIRECT_URI,
        },
      }
    );

    console.log("Slack API Response:", response.data); // ✅ Slack APIのレスポンスをログに出力

    if (!response.data.ok) {
      return NextResponse.json(
        { error: `Slack API Error: ${response.data.error}` },
        { status: 400 }
      );
    }

    const { access_token, authed_user, team } = response.data;

    // ✅ Slack認証後に `userId` を含めて保存
    await prisma.slackAuth.upsert({
      where: { slackUserId: authed_user.id },
      update: { accessToken: access_token, workspaceId: team.id, userId }, // ✅ userId を保存
      create: {
        slackUserId: authed_user.id,
        accessToken: access_token,
        workspaceId: team.id,
        userId, // ✅ userId を保存
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  } catch (error) {
    console.error("Slack OAuth Error:", error);
    return NextResponse.json(
      { error: "OAuth authentication failed" },
      { status: 500 }
    );
  }
}
