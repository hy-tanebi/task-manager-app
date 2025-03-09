"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";

const TaskCreateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const openModal = () => setIsModalOpen(true);
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

      const taskData = {
        ...values,
        userId: data.user.id,
      };

      const { error: taskError } = await supabase
        .from("Task")
        .insert([taskData]);
      if (taskError) {
        console.error("タスク作成エラー:", taskError.message);
        return;
      }

      closeModal();
      router.refresh();
    } catch (error) {
      console.error("タスク作成エラー:", error);
    }
  };

  return (
    <div>
      <button onClick={openModal} className="btn btn-primary">
        Create
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold">タスク作成</h2>
        <TaskForm onClose={closeModal} onSubmit={handleCreateTask} />
      </Modal>
    </div>
  );
};

export default TaskCreateButton;
