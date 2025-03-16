"use client";
import { useState, useEffect } from "react";
import {
  fetchSlackStatus,
  disconnectSlack,
} from "../../actions/slackAuthService";

const SlackLoginButton = ({ userId }: { userId: string }) => {
  const [isSlackConnected, setIsSlackConnected] = useState<boolean | null>(
    null
  );

  const SLACK_AUTH_URL = process.env.NEXT_PUBLIC_SLACK_AUTH_URL || "";

  // 🔹 初回レンダリング時に Slack 連携状態を取得
  useEffect(() => {
    const checkSlackConnection = async () => {
      const isConnected = await fetchSlackStatus(userId);
      setIsSlackConnected(isConnected);
    };
    checkSlackConnection();
  }, [userId]);

  // 🔹 Slack 連携ボタンを押したときの処理
  const handleSlackLogin = () => {
    if (!SLACK_AUTH_URL) {
      console.error(
        "Slack認証URLが設定されていません。環境変数を確認してください。"
      );
      alert("Slack認証URLが設定されていません。環境変数を確認してください。");
      return;
    }
    window.location.href = `${SLACK_AUTH_URL}&state=${userId}`;
  };

  // 🔹 Slack 連携解除ボタンを押したときの処理
  const handleSlackLogout = async () => {
    if (!window.confirm("Slack連携を解除しますか？")) return;

    const isDisconnected = await disconnectSlack(userId);
    if (isDisconnected) {
      setIsSlackConnected(false);
    } else {
      console.error("Slack連携解除エラー");
    }
  };

  // 🔹 ローディング中の表示
  if (isSlackConnected === null) {
    return <span className="text-gray-500">Loading...</span>;
  }

  return (
    <div>
      {!isSlackConnected ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSlackLogin}
        >
          Slack連携
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-green-500">Slack連携済み</span>
          <button
            className="text-red-500 border px-2 py-1 rounded"
            onClick={handleSlackLogout}
          >
            解除
          </button>
        </div>
      )}
    </div>
  );
};

export default SlackLoginButton;
