import TaskDetail from "@/app/components/task/TaskDetail";
import { TaskCardTypes } from "@/app/types/type";
import { createClient } from "../../../../utils/supabase/server";

async function getDetailPage(id: number): Promise<TaskCardTypes | null> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
  console.log("🔍 API URL:", apiUrl);

  if (!apiUrl) {
    console.error("❌ 環境変数 `NEXT_PUBLIC_APP_URL` が設定されていません。");
    return null;
  }

  // ✅ Supabaseのセッションを取得
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.access_token) {
    console.error("❌ 認証エラー: ユーザーがログインしていません");
    return null;
  }

  console.log("🟢 認証トークン:", session.access_token);

  // ✅ `Authorization` ヘッダーを追加
  const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ APIエラー: ${res.status} - ${res.statusText}`);
    return null;
  }

  try {
    const detailData: TaskCardTypes = await res.json();
    console.log("🟢 取得したタスク:", detailData);
    return detailData;
  } catch (error) {
    console.error("❌ JSON パースエラー:", error);
    return null;
  }
}

const DetailTaskPage = async ({ params }: { params: { tasksId: string } }) => {
  const taskId = parseInt(params.tasksId, 10);
  if (isNaN(taskId)) {
    console.error("❌ 無効なタスクID:", params.tasksId);
    return <p className="text-center text-red-500">無効なタスクIDです</p>;
  }

  const detailData = await getDetailPage(taskId);

  return <TaskDetail detailData={detailData} />;
};

export default DetailTaskPage;
