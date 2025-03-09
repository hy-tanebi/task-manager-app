export interface TaskCardTypes {
  id: number;
  title: string;
  content: string | null;
  url: string | null;
  urlAlias: string | null;
  dueDate: string | Date;
  priority: string;
  status: string;
  assignee: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  userId: string;
}
