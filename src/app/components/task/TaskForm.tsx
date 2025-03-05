"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "../../../../utils/supabase/client"; // Supabaseクライアントのインポート

interface TaskFormProps {
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "タイトルは2文字以上" }),
  dueDate: z.string().min(1, { message: "期日を入力してください" }),
  priority: z.string(),
  assignee: z.string().min(1, { message: "依頼者を入力してください" }),
});

const TaskForm = ({ onClose }: TaskFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      priority: "low",
      assignee: "",
    },
  });

  const { handleSubmit, control } = form;

  const supabase = createClient(); // supabaseインスタンスの作成

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Supabase でユーザー情報を取得
      const { data, error } = await supabase.auth.getUser();

      if (error || !data || !data.user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      console.log("取得したユーザー情報:", data.user);
      const userId = data.user.id;

      const taskData = {
        ...values,
        userId,
      };

      if (!taskData.userId) {
        console.error("ユーザーIDが取得できません");
        return;
      }

      // **JWT トークンを含めたリクエスト**
      const { data: task, error: taskError } = await supabase
        .from("Task")
        .insert([taskData], { returning: "minimal" })
        .single();

      if (taskError) {
        console.error("タスク作成エラー", taskError.message);
      } else {
        console.log("タスク作成成功", task);
        onClose();
      }
    } catch (error) {
      console.error("タスク作成エラー:", error);
    }
  };

  return (
    <div className="pt-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タスクタイトル</FormLabel>
                <FormControl>
                  <Input placeholder="タスクタイトル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>期日</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="期日" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>優先度</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="優先度" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>依頼者</FormLabel>
                <FormControl>
                  <Input placeholder="依頼者を入力" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">作成</Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
