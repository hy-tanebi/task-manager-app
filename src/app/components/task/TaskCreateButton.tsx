import React, { useState } from "react";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

const TaskCreateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal} className="btn btn-primary">
        Create
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold">タスク作成</h2>
        <TaskForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default TaskCreateButton;
