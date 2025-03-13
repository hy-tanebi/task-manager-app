"use server";

import { IncomingWebhook } from "@slack/webhook";

interface paramType {
  message: string;
}

export async function sendSlackMessage({ message }: paramType) {
  const date = new Date();
  const time = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const url = process.env.SLACK_WEBHOOK_URL as string;
  const webhook = new IncomingWebhook(url);
  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "新規メッセージだよ",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `:book:*メッセージ:*\n${message}`,
          },
          {
            type: "mrkdwn",
            text: `:clock1:*日時:*\n${time}`,
          },
        ],
      },
    ],
  };
  await webhook.send(payload);
}
