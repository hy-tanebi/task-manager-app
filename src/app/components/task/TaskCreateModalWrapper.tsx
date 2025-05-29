import TaskCreateModal from "./TaskCreateModal";
import { getAssignees } from "../../../../utils/supabase/server";
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

interface TaskCreateModalWrapperProps {
  initialData?: TaskCardTypes;
  onSubmit: (values: TaskFormSchema) => void; // ✅ anyをやめて推論型に
  onClose: () => void;
}

const TaskCreateModalWrapper = async ({
  initialData,
  onSubmit,
  onClose,
}: TaskCreateModalWrapperProps) => {
  const assignees: AssigneeType[] = await getAssignees();

  return (
    <TaskCreateModal
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
      assignees={assignees}
    />
  );
};

export default TaskCreateModalWrapper;
