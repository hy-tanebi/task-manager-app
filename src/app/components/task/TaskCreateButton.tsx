"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import TaskCreateModal from "./TaskCreateModal";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { sendSlackMessage } from "@/actions/send-slack-message-action";
import { AssigneeType } from "@/app/types/type";

interface TaskCreateButtonProps {
  assignees: AssigneeType[];
  disabled?: boolean;
}

const TaskCreateButton: React.FC<TaskCreateButtonProps> = ({
  assignees,
  disabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const openModal = () => {
    if (!disabled) setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleCreateTask = async (values: {
    title: string;
    dueDate: string;
    priority: string;
    assignee: string;
    content?: string;
    url?: string;
    urlAlias?: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const userId = data.user.id;

      const { data: slackData, error: slackError } = await supabase
        .from("SlackAuth")
        .select("slackUserId")
        .eq("userId", userId)
        .maybeSingle();

      if (slackError || !slackData?.slackUserId) {
        console.error("Slack userId が見つかりません");
        return;
      }

      const slackUserId = slackData.slackUserId;

      const taskData = {
        ...values,
        userId,
      };

      const { error: taskError } = await supabase
        .from("Task")
        .insert([taskData]);
      if (taskError) {
        console.error("タスク作成エラー:", taskError.message);
        return;
      }

      const message = `📌 *新しいタスクが作成されました！*\n📝 *タイトル:* ${values.title}\n⏳ *期限:* ${values.dueDate}\n🔥 *優先度:* ${values.priority}\n👤 *担当者:* ${values.assignee}`;
      await sendSlackMessage({ userId: slackUserId, message });

      closeModal();
      router.refresh();
    } catch (error) {
      console.error("タスク作成エラー:", error);
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        className={`bg-white text-black py-2 px-4 rounded hover:opacity-80 duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        Create
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-bold">タスク作成</h2>
          <TaskCreateModal
            onSubmit={handleCreateTask}
            onClose={closeModal}
            assignees={assignees}
          />
        </Modal>
      )}
    </div>
  );
};

export default TaskCreateButton;
