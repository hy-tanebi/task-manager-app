import { createClient } from "../../../../utils/supabase/server";
import { AssigneeType } from "@/app/types/type";

export default async function AssigneeSelect({
  defaultValue,
  name = "assigneeId",
}: {
  defaultValue?: string;
  name?: string;
}) {
  const supabase = createClient();
  const { data: assignees, error } = await supabase.from("Assignee").select();

  if (error) {
    console.error("❌ Assignee取得エラー", error);
    return <p className="text-red-500">依頼者が取得できませんでした</p>;
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-bold">
        依頼者を選択
      </label>
      <select
        name={name}
        id={name}
        defaultValue={defaultValue}
        className="w-full border border-gray-300 rounded px-2 py-1"
        required
      >
        <option value="" disabled>
          -- 依頼者を選んでください --
        </option>
        {assignees?.map((assignee: AssigneeType) => (
          <option key={assignee.id} value={assignee.id}>
            {assignee.name}
          </option>
        ))}
      </select>
    </div>
  );
}
