"use server";

import { LoginSchema, SignupSchema } from "@/schemas";
import { z } from "zod";
import { createClient } from "../../utils/supabase/server";

// アカウント作成
export const signup = async (values: z.infer<typeof SignupSchema>) => {
  try {
    const supabase = createClient();

    // アカウント作成
    const { data, error: signupError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/signup/verify`,
      },
    });

    if (signupError) {
      return { error: signupError.message };
    }

    if (!data.user) {
      return { error: "ユーザーが作成されませんでした" };
    }

    console.log("🟢 アカウント作成成功:", data.user.email);

    // ✅ 認証セッションを最新化
    await supabase.auth.refreshSession();

    // ✅ 現在のセッションを取得
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      return { error: "セッションの取得に失敗しました" };
    }

    // ✅ プロフィールの名前を更新
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name: values.name })
      .eq("id", data.user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    return {}; // エラーなし
  } catch (err) {
    console.error("❌ サインアップ処理エラー:", err);
    return { error: "エラーが発生しました" };
  }
};

// ログイン
export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      ...values,
    });
    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    console.error("❌ ログインエラー:", error);
    return { error: "エラーが発生しました" };
  }
};
