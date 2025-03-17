import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tasksId: string } }
) {
  console.log(`🟢 APIリクエスト: tasksId = ${params.tasksId}`);

  const tasksId = parseInt(params.tasksId, 10);
  if (isNaN(tasksId)) {
    console.error("❌ 無効なタスクID:", params.tasksId);
    return NextResponse.json({ error: "無効なタスクID" }, { status: 400 });
  }

  try {
    console.log(`🔍 データ取得開始: id = ${tasksId}`);

    const taskDetailData = await prisma.task.findUnique({
      where: { id: tasksId },
    });

    if (!taskDetailData) {
      console.warn(`⚠️ タスクが見つかりません: id = ${tasksId}`);
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      );
    }

    console.log("🟢 取得成功:", taskDetailData);
    return NextResponse.json(taskDetailData);
  } catch (error) {
    console.error("❌ Prisma クエリエラー:", error);
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { tasksId: string } }
) {
  try {
    const tasksId = parseInt(params.tasksId);
    const updatedData = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id: tasksId },
      data: updatedData,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("❌ 更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tasksId: string } }
) {
  const tasksId = parseInt(params.tasksId, 10);
  console.log(`🟢 削除リクエスト受信: tasksId = ${tasksId}`);

  if (isNaN(tasksId)) {
    console.error("❌ 無効なタスクID:", params.tasksId);
    return NextResponse.json({ error: "無効なタスクID" }, { status: 400 });
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: tasksId },
    });
    if (!existingTask) {
      console.warn(`⚠️ タスクが見つかりません: id = ${tasksId}`);
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      );
    }

    console.log(`🟢 タスク削除開始: id = ${tasksId}`);
    await prisma.task.delete({ where: { id: tasksId } });

    console.log("✅ タスク削除成功");
    return NextResponse.json(
      { message: "タスクが削除されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ タスク削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
