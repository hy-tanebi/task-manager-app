"use client";

import TaskForm from "./TaskForm";
import { TaskCardTypes, AssigneeType } from "@/app/types/type";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2),
  dueDate: z.string().min(1),
  priority: z.string(),
  assignee: z.string().min(1),
  content: z.string().optional(),
  url: z.string().url().optional(),
  urlAlias: z.string().optional(),
});

type TaskFormSchema = z.infer<typeof formSchema>;

interface TaskCreateModalProps {
  initialData?: TaskCardTypes;
  onSubmit: (values: TaskFormSchema) => void;
  onClose: () => void;
  assignees: AssigneeType[];
}

const TaskCreateModal = ({
  initialData,
  onSubmit,
  onClose,
  assignees,
}: TaskCreateModalProps) => {
  return (
    <TaskForm
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
      assignees={assignees}
    />
  );
};

export default TaskCreateModal;
