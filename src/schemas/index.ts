import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(1, {
    message: "お名前を入力してください",
  }),
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});

// 🆕 タスク作成用
export const taskFormSchema = z.object({
  title: z.string().min(1, { message: "タイトルを入力してください" }),
  dueDate: z.string().min(1, { message: "期日を入力してください" }),
  priority: z.string().min(1, { message: "優先度を選択してください" }),
  assignee: z.string().min(1, { message: "依頼者を選択してください" }),
  content: z.string().optional(),
  url: z.string().url({ message: "有効なURLを入力してください" }).optional(),
  urlAlias: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
