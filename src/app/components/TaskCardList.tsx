import React from "react";
import { TaskCardTypes } from "../types/type";
import TaskCard from "./TaskCard";

interface TaskCardListProps {
  blogData: TaskCardTypes[];
}

const TaskCardList = ({ blogData }: TaskCardListProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-4 auto-rows-fr">
      {blogData.map((blog) => (
        <TaskCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default TaskCardList;
