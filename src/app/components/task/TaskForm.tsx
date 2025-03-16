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
import { TaskCardTypes } from "@/app/types/type";

interface TaskFormProps {
  initialData?: TaskCardTypes; // 既存データ（編集時のみ）
  onSubmit: (values: z.infer<typeof formSchema>) => void; // 修正 // 作成 or 編集の処理を渡す
  onClose?: () => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "タイトルは2文字以上" }),
  dueDate: z.string().min(1, { message: "期日を入力してください" }),
  priority: z.string(),
  assignee: z.string().min(1, { message: "依頼者を入力してください" }),
  content: z.string().optional(),
  url: z.string().url({ message: "正しいURLを入力してください" }).optional(),
  urlAlias: z.string().optional(),
});

const TaskForm = ({ initialData, onSubmit }: TaskFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          dueDate:
            initialData.dueDate instanceof Date
              ? initialData.dueDate.toISOString().split("T")[0]
              : initialData.dueDate || "",
          priority: initialData.priority,
          assignee: initialData.assignee,
          content: initialData.content ?? undefined,
          url: initialData.url ?? undefined,
          urlAlias: initialData.urlAlias ?? undefined,
        }
      : {
          title: "",
          dueDate: "",
          priority: "低",
          assignee: "",
          content: "",
          url: "",
          urlAlias: "",
        },
  });

  const { handleSubmit, control } = form;

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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課題URL</FormLabel>
                <FormControl>
                  <Input placeholder="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="urlAlias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URLのエイリアス</FormLabel>
                <FormControl>
                  <Input placeholder="例: GitHubリポジトリ" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="優先度" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="低">低</SelectItem>
                    <SelectItem value="中">中</SelectItem>
                    <SelectItem value="高">高</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備考</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
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
          <Button type="submit">{initialData ? "更新" : "作成"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
