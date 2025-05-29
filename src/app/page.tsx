// src/app/page.tsx
import { createClient } from "../../utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: assignees, error } = await supabase.from("Assignee").select();

  if (error) {
    console.error("❌ Assignee取得エラー:", error.message);
    return <p className="text-center">依頼者の取得に失敗しました</p>;
  }

  if (!assignees || assignees.length === 0) {
    return <p className="text-center">依頼者が登録されていません</p>;
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {assignees.map((assignee) => (
        <div
          key={assignee.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {assignee.imageUrl && (
            <Image
              src={assignee.imageUrl}
              alt={assignee.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex flex-col items-center text-center space-y-2">
            <h2 className="text-lg font-bold">{assignee.name}</h2>
            <Link href={`/assignees/${assignee.id}`}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                タスクはこちら
              </button>
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
}
