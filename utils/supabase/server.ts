import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AssigneeType } from "@/app/types/type";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getAssignees(): Promise<AssigneeType[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("Assignee").select("*");

  if (error) {
    console.error("❌ Assignee取得エラー:", error.message);
    return [];
  }

  return data ?? [];
}
