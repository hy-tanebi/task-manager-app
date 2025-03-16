"use server";
import axios from "axios";
import prisma from "@/lib/prismaClient";

interface SlackMessagePayload {
  userId: string; //  Slack の `slackUserId`
  message: string;
}

export async function sendSlackMessage({
  userId, // Slack の `slackUserId`
  message,
}: SlackMessagePayload) {
  try {
    console.log("Searching for Slack access token with slackUserId:", userId);

    // 🔹 `slackUserId` で検索する（Supabase の `userId` ではなく）
    const slackAuth = await prisma.slackAuth.findUnique({
      where: { slackUserId: userId }, //  Slack の userId で検索
    });

    if (!slackAuth) {
      console.error("No Slack auth record found for slackUserId:", userId);
      return { error: "Slack access token not found" };
    }

    const accessToken = slackAuth.accessToken; // Slack の access token

    console.log("Found Slack access token:", accessToken);

    // 2. Slack にメッセージを送信
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: userId, // 🔹 Slack の `user_id` に送信
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.ok) {
      console.error("Slack API Error:", response.data.error);
      return { error: `Slack API Error: ${response.data.error}` };
    }

    return { success: "Slack message sent successfully" };
  } catch (error) {
    console.error("Slack Notification Error:", error);
    return { error: "Failed to send Slack notification" };
  }
}
