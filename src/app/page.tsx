import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import Loading from "./loading";
import TaskCardList from "./components/TaskCardList";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();

  // ✅ ログインユーザーのセッション情報を取得
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    redirect("/login"); // 🔹 未認証ならログインページへ
  }

  const userId = sessionData.session.user.id;

  // ✅ ログインユーザーのタスクを取得
  const { data: taskData, error } = await supabase
    .from("Task")
    .select()
    .eq("userId", userId) // 🔹 ログインユーザーのタスクのみ取得
    .order("createdAt");

  if (!taskData || error) {
    return <p className="text-center">タスクがありません</p>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <TaskCardList blogData={taskData} />
      </div>
    </Suspense>
  );
}
