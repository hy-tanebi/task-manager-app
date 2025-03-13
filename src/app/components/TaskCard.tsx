"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useTransition } from "react";
import { TaskCardTypes } from "../types/type";
import Link from "next/link";
import { deleteTask } from "@/actions/taskActions";

interface TaskCardProps {
  blog: TaskCardTypes;
}

const TaskCard = ({ blog }: TaskCardProps) => {
  const { id, title, dueDate, priority, assignee, createdAt, url, urlAlias } =
    blog;

  const parsedDueDate =
    typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const timeDate = parsedDueDate.toLocaleDateString("ja-JP");

  const parsedCreateDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const createDate = parsedCreateDate.toLocaleDateString("ja-JP");

  const now = new Date();
  const daysRemaining = Math.ceil(
    (parsedDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 3;
  const isExpired = daysRemaining < 0;

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("このタスクを削除しますか？")) return;

    startTransition(async () => {
      const result = await deleteTask(id);
      if (result.success) {
        alert("タスクが削除されました");
        location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div>
      <Card className="min-h-[270px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <p className="pt-2">
              作成日：
              <span className="font-bold">{createDate}</span>
            </p>
            <Link href={`/tasks/${id}`}>課題詳細</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-bold">課題URL</span>：
            {url && (
              <Link
                href={url}
                target="_blank"
                className="text-blue-400 font-bold hover:opacity-65 hover:duration-500"
              >
                {urlAlias ? urlAlias : url}
              </Link>
            )}
          </div>
          <p>
            <span className="font-bold">優先度</span>：{priority}
          </p>
          <p>
            <span className="font-bold">依頼者</span>：{assignee}
          </p>
          <div className="flex items-center space-x-2">
            {isExpired ? (
              <p className="text-gray-500 font-bold">
                期日：{timeDate}{" "}
                <span className="text-gray-700 text-lg">🔥</span>
              </p>
            ) : isUrgent ? (
              <p className="text-red-500 font-bold">
                期日：{timeDate}{" "}
                <span className="text-red-500 text-lg">💣</span>
              </p>
            ) : (
              <p className="font-bold">期日：{timeDate}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className={`px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "削除中..." : "削除"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskCard;
