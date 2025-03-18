
---

## **技術構成**
### **フロントエンド**
- **Next.js 14**（App Router 使用）
- **React 18**
- **Tailwind CSS**（UI スタイリング）
- **Shadcn/ui**（UI コンポーネント）

### **バックエンド**
- **Next.js API Routes**
- **Supabase（PostgreSQL）**
- 認証（Auth）・データベース（Task, SlackAuth テーブル）
- **Prisma ORM**
- Supabase の PostgreSQL にアクセス
- **Slack API**
- OAuth 認証 & タスク通知

---

## **データベース設計**
### **1. `users` テーブル**
| カラム名  | 型       | 説明 |
|-----------|---------|------|
| `id` | UUID | ユーザーの一意 ID（Supabase Auth） |
| `email` | TEXT | ユーザーのメールアドレス |

### **2. `tasks` テーブル**
| カラム名  | 型       | 説明 |
|-----------|---------|------|
| `id` | SERIAL | タスクの一意 ID |
| `title` | TEXT | タスクのタイトル |
| `dueDate` | TIMESTAMP | 期日 |
| `priority` | TEXT | 優先度（低/中/高） |
| `status` | TEXT | ステータス（未着手/進行中/完了） |
| `assignee` | TEXT | 担当者 |
| `content` | TEXT | タスクの詳細 |
| `url` | TEXT | 関連 URL |
| `userId` | UUID | タスクを作成したユーザーの ID |

### **3. `SlackAuth` テーブル**
| カラム名  | 型       | 説明 |
|-----------|---------|------|
| `id` | SERIAL | 一意 ID |
| `userId` | UUID | Supabase Auth の `userId` |
| `slackUserId` | TEXT | Slack のユーザー ID |

---

## **アプリの動作フロー**
### **1. ユーザー登録 & ログイン**
1. Supabase Auth でログイン（メール認証）
2. 自分のタスク一覧が表示される（他のユーザーのタスクは見えない）

### **2. Slack 連携**
1. **Slack 連携ボタンを押す**
2. Slack OAuth にリダイレクト
3. ユーザーがワークスペースを選択し、連携許可
4. Supabase の `SlackAuth` テーブルに `userId` と `slackUserId` を保存

### **3. タスクの作成**
1. `Create` ボタンを押す（**Slack 連携がない場合は作成不可**）
2. フォーム入力（タイトル・期日・担当者など）
3. **タスクが DB に保存され、Slack に通知が送信される**
4. トップページに新規タスクが追加される
5. **課題詳細はこちらをクリック** をクリックすることで詳細ページへ遷移

### **4. タスクの更新 & 削除**
1. **課題詳細はこちらをクリック** でタスクの詳細ページに遷移
2. **編集ボタン** からタスクの内容を変更（DB も更新）
3. **更新ボタン**で編集内容を保存
4. **削除ボタン** でタスクを削除

---

## **今後の展望**
- **通知機能の強化**
- **リマインダー**: 期日が近づいたら Slack に通知
- **カスタム通知**: ユーザーが自由に通知設定を変更可能
- **ワークスペースごとにタスクを管理**
---
