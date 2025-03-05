import { createClient } from "../../../../utils/supabase/server"; // supabaseクライアントのインポート
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  try {
    const { data: user, error } = await supabase.auth.getUser();

    // ユーザーが取得できた場合、ユーザー情報を返す
    if (error || !user) {
      return NextResponse.json(
        { error: "ユーザーがログインしていません" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return NextResponse.json(
      { error: "ユーザー情報取得エラー" },
      { status: 500 }
    );
  }
}
