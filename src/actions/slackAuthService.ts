import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

/**
 * @param userId - Supabase のユーザー ID
 * @returns 連携済みなら true, 未連携なら false
 */
export const fetchSlackStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data, error } = await supabase
      .from("SlackAuth")
      .select("id")
      .eq("userId", userId)
      .maybeSingle();

    if (error) {
      console.error("fetchSlackStatus: Supabaseエラー", error.message);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("fetchSlackStatus: 予期せぬエラー", error);
    return false;
  }
};
/**
 * Slack 連携を解除する
 * @param userId - Supabase のユーザー ID
 * @returns 削除成功なら true, 失敗なら false
 */
export const disconnectSlack = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  const { error } = await supabase
    .from("SlackAuth")
    .delete()
    .eq("userId", userId);

  return !error;
};
