import { createClient } from "../../../../utils/supabase/server";
import TaskCardList from "@/app/components/TaskCardList";
import Image from "next/image";

export default async function AssigneePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // 🔹 Assignee を取得
  const { data: assignee, error: assigneeError } = await supabase
    .from("Assignee")
    .select()
    .eq("id", params.id)
    .single();

  if (assigneeError || !assignee) {
    return <p className="text-center">依頼者が見つかりません</p>;
  }

  // 🔹 タスクを取得（assigneeId に紐づく）
  const { data: tasks, error: taskError } = await supabase
    .from("Task")
    .select()
    .eq("assigneeId", params.id)
    .order("createdAt", { ascending: false });

  if (taskError) {
    console.error("❌ タスク取得エラー:", taskError.message);
    return <p className="text-center">タスクの取得に失敗しました</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {assignee.imageUrl && (
          <Image
            src={assignee.imageUrl}
            alt={assignee.name}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <h1 className="text-2xl font-bold">{assignee.name} のタスク一覧</h1>
      </div>

      {tasks.length > 0 ? (
        <TaskCardList blogData={tasks} />
      ) : (
        <p className="text-center text-gray-500">タスクが登録されていません</p>
      )}
    </div>
  );
}
