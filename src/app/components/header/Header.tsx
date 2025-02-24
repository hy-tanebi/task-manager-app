"use client";
import { User } from "@supabase/supabase-js";
import Button from "../Button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Link from "next/link";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますが、宜しいですか？")) {
      return;
    }
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header>
      <div className="grid lg:grid-cols-2 bg-red-300 px-2 py-4 place-items-center">
        <h1 className="text-4xl">
          <Link href={"/"}>タスク管理アプリ</Link>
        </h1>
        <nav className="flex gap-4 text-2xl">
          {user ? (
            <>
              <li>
                <Button title="Create" href="/create" />
              </li>
              <li>
                <div className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button title="LogIn" href="/login" />
              </li>
              <li>
                <Button title="SignUp" href="/signup" />
              </li>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
