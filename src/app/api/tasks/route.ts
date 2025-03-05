import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, dueDate, priority, assignee, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      );
    }

    // userId が User テーブルに存在するかチェック
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "指定されたユーザーが存在しません" },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        priority,
        assignee,
        userId,
      },
    });

    return NextResponse.json({ data: newTask });
  } catch (error) {
    console.error("タスク作成エラー:", error);
    return NextResponse.json({ error: "タスク作成エラー" }, { status: 500 });
  }
}
