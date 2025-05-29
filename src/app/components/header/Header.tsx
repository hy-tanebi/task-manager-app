"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Button from "../Button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Link from "next/link";
import TaskCreateButton from "../task/TaskCreateButton";
import SlackLoginButton from "../SlackLoginButton";
import { fetchSlackStatus } from "@/actions/slackAuthService";
import { AssigneeType } from "@/app/types/type";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const supabase = createClient();
  const [isSlackConnected, setIsSlackConnected] = useState<boolean | null>(
    null
  );
  const [assignees, setAssignees] = useState<AssigneeType[]>([]);

  // 🔹 Slack連携状態 & assignee取得
  useEffect(() => {
    if (!user) return;

    const checkSlackStatus = async () => {
      const connected = await fetchSlackStatus(user.id);
      setIsSlackConnected(connected);
    };

    const fetchAssignees = async () => {
      const { data, error } = await supabase.from("Assignee").select("*");
      if (error) {
        console.error("Assigneeの取得に失敗:", error.message);
        return;
      }
      setAssignees(data);
    };

    checkSlackStatus();
    fetchAssignees();
  }, [user]);

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますが、宜しいですか？")) return;
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header>
      <div className="grid lg:grid-cols-2 bg-red-300 px-2 py-4 place-items-center">
        <h1 className="text-4xl hover:opacity-45 duration-300">
          <Link href="/">TaskApp</Link>
        </h1>
        <nav className="flex gap-4 text-2xl pt-4 lg:pt-0">
          {user ? (
            <>
              <li>
                <SlackLoginButton
                  userId={user.id}
                  onStatusChange={setIsSlackConnected}
                />
              </li>
              <li>
                <TaskCreateButton
                  disabled={!isSlackConnected}
                  assignees={assignees}
                />
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
