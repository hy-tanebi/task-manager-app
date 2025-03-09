import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import Loading from "./loading";
import TaskCardList from "./components/TaskCardList";

export default async function Home() {
  const supabase = createClient();

  const { data: blogData, error } = await supabase
    .from("Task")
    .select()
    .order("createdAt");
  if (!blogData || error) {
    return <p className="text-center">ブログが投稿されていません</p>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        <TaskCardList blogData={blogData} />
      </div>
    </Suspense>
  );
}
