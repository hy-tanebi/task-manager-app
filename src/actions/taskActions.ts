"use server"; // ✅ 必須

import prisma from "@/lib/prismaClient";

export async function deleteTask(taskId: number) {
  console.log(`🟢 サーバーで削除処理開始: id = ${taskId}`);

  if (isNaN(taskId)) {
    console.error("❌ 無効なタスクID:", taskId);
    return { error: "無効なタスクID" };
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      console.warn(`⚠️ タスクが見つかりません: id = ${taskId}`);
      return { error: "タスクが見つかりません" };
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    console.log("✅ タスク削除成功");
    return { success: true };
  } catch (error) {
    console.error("❌ タスク削除エラー:", error);
    return { error: "削除に失敗しました" };
  }
}
