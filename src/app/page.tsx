import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import Loading from "./loading";
import TaskCardList from "./components/TaskCardList";

export default async function Home() {
  const supabase = createClient();

  // 🔹 ログインユーザーを取得
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return <p className="text-center">ログインしてください</p>;
  }
  const userId = user.user.id;

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
