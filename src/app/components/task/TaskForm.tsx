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
import { TaskCardTypes, AssigneeType } from "@/app/types/type";

interface TaskFormProps {
  initialData?: TaskCardTypes;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onClose?: () => void;
  assignees: AssigneeType[];
}

const formSchema = z.object({
  title: z.string().min(2, { message: "タイトルは2文字以上" }),
  dueDate: z.string().min(1, { message: "期日を入力してください" }),
  priority: z.string(),
  assignee: z.string().min(1, { message: "依頼者を選択してください" }),
  content: z.string().optional(),
  url: z.string().url({ message: "正しいURLを入力してください" }).optional(),
  urlAlias: z.string().optional(),
});

const TaskForm = ({ initialData, onSubmit, assignees }: TaskFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          dueDate:
            typeof initialData.dueDate === "string"
              ? initialData.dueDate
              : initialData.dueDate.toISOString().split("T")[0],
          priority: initialData.priority,
          assignee: initialData.assignee,
          content: initialData.content ?? "", // null → 空文字 or undefined
          url: initialData.url ?? "",
          urlAlias: initialData.urlAlias ?? "",
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
          {/* 各フィールド */}
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
                  <Input placeholder="https://example.com" {...field} />
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
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>優先度</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="優先度を選択" />
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
                  <Input {...field} />
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
                  <select
                    {...field}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="" disabled>
                      -- 依頼者を選んでください --
                    </option>
                    {assignees?.map((assignee) => (
                      <option key={assignee.id} value={assignee.name}>
                        {assignee.name}
                      </option>
                    ))}
                  </select>
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
