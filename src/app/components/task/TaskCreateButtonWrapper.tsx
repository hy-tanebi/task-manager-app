// src/app/components/task/TaskCreateButtonWrapper.tsx
import { getAssignees } from "../../../../utils/supabase/server";
import TaskCreateButton from "./TaskCreateButton";

const TaskCreateButtonWrapper = async () => {
  const assignees = await getAssignees();

  return <TaskCreateButton assignees={assignees} />;
};

export default TaskCreateButtonWrapper;
