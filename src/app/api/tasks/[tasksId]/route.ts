// import prisma from "@/lib/prismaClient";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: { tasksId: string } }
// ) {
//   const tasksId = params.tasksId;
//   const taskDetailData = await prisma.task.findUnique({
//     where: {
//       id: parseInt(tasksId),
//     },
//   });

//   return NextResponse.json(taskDetailData);
// }

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
