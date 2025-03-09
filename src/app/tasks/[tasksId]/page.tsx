import TaskDetail from "@/app/components/task/TaskDetail";
import { TaskCardTypes } from "@/app/types/type";
async function getDetailPage(id: number): Promise<TaskCardTypes | null> {
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    cache: "no-store",
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

const DetailTaskPage = async ({ params }: { params: { tasksId: number } }) => {
  const detailData = await getDetailPage(params.tasksId);
  return <TaskDetail detailData={detailData} />;
};

export default DetailTaskPage;
