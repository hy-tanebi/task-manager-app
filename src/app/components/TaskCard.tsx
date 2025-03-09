import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { TaskCardTypes } from "../types/type";
import Link from "next/link";

interface TaskCardProps {
  blog: TaskCardTypes;
}

const TaskCard = ({ blog }: TaskCardProps) => {
  const { title, dueDate, priority, assignee, createdAt, url, urlAlias } = blog;

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
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 3; // 🔥 3日以内
  const isExpired = daysRemaining < 0; // 💣 期限切れ

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
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
};

export default TaskCard;
