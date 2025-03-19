"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/server";

const supabase = createClient();

const SignupVerifyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        await supabase.auth.setSession(data.session);
        console.log("✅ セッションセット完了:", data.session);
        setLoading(false);
        router.push("/");
      } else {
        console.error("❌ セッション取得エラー:", error);
        setLoading(false);
      }
    };

    syncSession();
  }, [router]);

  return (
    <div className="w-[500px] bg-white p-5 rounded-xl border">
      <div className="text-primary text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        {loading ? "認証中..." : "アカウント本登録完了しました"}
      </div>

      {!loading && (
        <>
          <div className="text-sm text-center mb-5">
            アカウント本登録が完了しました。
          </div>
          <Button asChild className="w-full">
            <Link href="/">トップページ</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default SignupVerifyPage;
