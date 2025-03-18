import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { tasksId: string } }
) {
  console.log(`🟢 APIリクエスト: tasksId = ${params.tasksId}`);

  const supabase = createClient();
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    console.error("❌ 認証エラー: Authorization ヘッダーがありません");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  console.log("🟢 受信したトークン:", token);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    console.error("❌ 認証エラー: ユーザーがログインしていません");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = data.user.id;
  console.log(`🟢 認証ユーザー: ${userId}`);

  const tasksId = parseInt(params.tasksId, 10);
  if (isNaN(tasksId)) {
    console.error("❌ 無効なタスクID:", params.tasksId);
    return NextResponse.json({ error: "無効なタスクID" }, { status: 400 });
  }

  try {
    console.log(`🔍 データ取得開始: id = ${tasksId}`);

    const taskDetailData = await prisma.task.findUnique({
      where: { id: tasksId, userId }, // ✅ ユーザーごとに取得
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
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "未認証のユーザー" }, { status: 401 });
  }

  const userId = data.user.id;
  const tasksId = parseInt(params.tasksId, 10);
  const updatedData = await req.json();

  try {
    // ✅ ユーザーのタスクのみ更新
    const updatedTask = await prisma.task.update({
      where: { id: tasksId, userId }, // ✅ ユーザーIDでフィルタ
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
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "未認証のユーザー" }, { status: 401 });
  }

  const userId = data.user.id;
  const tasksId = parseInt(params.tasksId, 10);

  console.log(
    `🟢 削除リクエスト受信: tasksId = ${tasksId}, userId = ${userId}`
  );

  if (isNaN(tasksId)) {
    console.error("❌ 無効なタスクID:", params.tasksId);
    return NextResponse.json({ error: "無効なタスクID" }, { status: 400 });
  }

  try {
    // ✅ 自分のタスクのみ削除できるようにする
    const existingTask = await prisma.task.findUnique({
      where: { id: tasksId, userId }, // ✅ ユーザーIDでフィルタ
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
