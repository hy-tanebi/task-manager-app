import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // ✅ セッションを取得
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    console.log("🟢 セッション情報:", session);
    console.log("🟡 クッキー情報:", request.cookies.getAll());

    if (sessionError) {
      console.error("🔴 セッション取得エラー:", sessionError.message);
    }

    // ✅ セッションが無い場合、リフレッシュ
    if (!session || !session.session) {
      console.log("⚠️ セッションなし → リフレッシュ試行");

      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("🔴 セッションリフレッシュエラー:", refreshError.message);
      } else {
        console.log("✅ セッションリフレッシュ成功:", refreshData);
      }
    }
  } catch (err) {
    console.error("🔴 Middleware エラー:", err);
  }

  return supabaseResponse;
}
