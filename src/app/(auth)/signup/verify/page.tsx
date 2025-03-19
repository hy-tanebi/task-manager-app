"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";

const SignupVerifyPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const verifySession = async () => {
      if (!code) return;

      // ✅ 認証コードを使ってセッションを更新
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("❌ セッション更新エラー:", error);
      } else {
        console.log("✅ セッション更新成功");
        router.refresh(); // ページをリロードしてログイン状態を反映
      }
    };

    verifySession();
  }, [router, supabase, code]);

  return (
    <div className="w-[500px] bg-white p-5 rounded-xl border">
      <div className="text-primary text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        アカウント本登録完了しました
      </div>

      <div className="text-sm text-center mb-5">
        アカウント本登録が完了しました。
      </div>

      <Button asChild className="w-full">
        <Link href="/">トップページ</Link>
      </Button>
    </div>
  );
};

export default SignupVerifyPage;
