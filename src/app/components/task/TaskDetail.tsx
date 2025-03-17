"use client";

import { TaskCardTypes } from "@/app/types/type";
import Link from "next/link";
import React, { useState } from "react";
import TaskForm from "./TaskForm";
import { useRouter } from "next/navigation";

interface TaskDetailProps {
  detailData: TaskCardTypes | null;
}

const TaskDetail = ({ detailData }: TaskDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  console.log("🟢 detailData の中身:", detailData);

  if (!detailData) {
    return (
      <div className="w-1/2 m-auto pt-10 text-center">
        <h1 className="text-2xl text-red-500">データが見つかりません</h1>
        <p>指定されたタスクが存在しないか、削除されました。</p>
      </div>
    );
  }

  const {
    id,
    title,
    priority,
    dueDate,
    createdAt,
    url,
    urlAlias,
    content,
    assignee,
  } = detailData;

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

  // 🔄 更新処理
  const handleUpdate = async (updatedTask: Partial<TaskCardTypes>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("❌ 更新エラー:", error);
    }
  };

  return (
    <div className="w-1/2 m-auto pt-10">
      {isEditing ? (
        <TaskForm
          initialData={detailData}
          onSubmit={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h1 className="text-4xl">{title}</h1>
          <div className="pt-4">
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
          <p className="pt-2">
            <span className="font-bold">優先度</span>：{priority}
          </p>
          <p className="pt-2">
            <span className="font-bold">作成日</span>：{createDate}
          </p>
          <div className="flex items-center space-x-2 pt-2">
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
          <p className="pt-4">
            <span className="font-bold">依頼者</span>：{assignee}
          </p>
          <p className="pt-4">
            <span className="font-bold">詳細</span>：{content}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
          >
            編集
          </button>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
