import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import Loading from "./loading";
import TaskCardList from "./components/TaskCardList";

export default async function Home() {
  const supabase = createClient();

  // 🔹 セッションを取得
  let { data: session } = await supabase.auth.getSession();
  const { error: sessionError } = await supabase.auth.getSession(); // error だけを const にする

  if (sessionError) {
    console.error("⚠️ セッション取得エラー:", sessionError.message);
  }

  // 🔹 セッションが無い場合、リフレッシュを試す
  if (!session || !session.session) {
    console.log("⚠️ セッションなし → リフレッシュ試行");

    const { data: refreshedSession, error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError) {
      console.error("🔴 セッションリフレッシュエラー:", refreshError.message);
      return <p className="text-center">ログインしてください</p>;
    } else {
      console.log("✅ セッションリフレッシュ成功:", refreshedSession);
      session = refreshedSession; // 🔹 ここで再代入
    }
  }

  const userId = session.session?.user.id;

  // 🔹 ユーザーごとのタスクを取得
  const { data: blogData, error } = await supabase
    .from("Task")
    .select()
    .eq("userId", userId) // 🔹 ログインユーザーのタスクのみ取得
    .order("createdAt");

  if (!blogData || error) {
    return <p className="text-center">タスクがありません</p>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        <TaskCardList blogData={blogData} />
      </div>
    </Suspense>
  );
}
