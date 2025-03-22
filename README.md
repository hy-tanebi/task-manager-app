# タスク管理アプリ概要

このプロジェクトは、**ユーザーごとのタスク管理**を可能にし、Slack との連携を通じてタスクの通知を受け取ることができる**タスク管理アプリケーション**です。  
Next.js、Supabase、Prisma を使用し、**認証機能・CRUD 操作・Slack 通知機能**を実装しています。

---

##デモ
以下のテスト用ユーザーでログインして機能をお試しいただけます：

ユーザー名: <code>test2@test.com</code><br>
パスワード: testuser<br>

[Slack連携タスク管理アプリ](https://task-manager-app-8fbh.vercel.app/)<br>

## **主な機能**

### **1. 認証機能**

- **Supabase Auth** を使用した **メール/パスワード認証**
- **ユーザーごとのタスク表示**
  - 各ユーザーは、自分が作成したタスクのみ閲覧・編集・削除可能
- **Slack 認証と連携**
  - ユーザーが Slack OAuth を通じてアプリと連携
  - **連携しないとタスクの作成ができない**

### **2. タスク管理機能**

- **タスク作成**
  - タイトル、期日、優先度、担当者、詳細、関連 URL を入力可能
  - **Slack 連携済みのユーザーのみ作成可能**
- **タスク一覧表示**
  - **ログインユーザーのタスクのみ表示**
  - 作成日時順にソート
- **タスク詳細ページ**
  - タスクごとの詳細を確認可能
  - 期日の残り日数に応じて表示を変更（例: **💣 期限間近、🔥 期限切れ**）
- **タスク編集**
  - タイトル・期日・優先度・担当者・詳細・URL などを更新可能
- **タスク削除**
  - タスクを削除し、一覧から非表示にする

### **3. Slack 通知機能**

- タスク作成時に **Slack に通知を送信**
- ユーザーの Slack アカウントと紐づけ、**DM または特定チャンネルに通知**
- 通知内容：新しいタスクが作成されました！ 📝 タイトル: {タスク名} ⏳ 期限: {期日} 🔥 優先度: {低 / 中 / 高} 👤 担当者: {担当者名}

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

### **1. `task` テーブル**

| カラム名    | 型        | 説明                             |
| ----------- | --------- | -------------------------------- |
| `id`        | SERIAL    | タスクの一意 ID                  |
| `title`     | TEXT      | タスクのタイトル                 |
| `dueDate`   | TIMESTAMP | 期日                             |
| `priority`  | TEXT      | 優先度（低/中/高）               |
| `status`    | TEXT      | ステータス（未着手/進行中/完了） |
| `assignee`  | TEXT      | 担当者                           |
| `createdAt` | TIMESTAMP | 作成日時                         |
| `updatedAt` | TIMESTAMP | 更新日時                         |
| `userId`    | UUID      | タスクを作成したユーザーの ID    |
| `content`   | TEXT      | タスクの詳細                     |
| `url`       | TEXT      | 関連 URL                         |
| `urlAlias`  | TEXT      | URL のエイリアス                 |

### **2. `SlackAuth` テーブル**

| カラム名      | 型        | 説明                      |
| ------------- | --------- | ------------------------- |
| `id`          | UUID      | 一意 ID                   |
| `accessToken` | TEXT      | Slack のアクセストークン  |
| `createdAt`   | TIMESTAMP | 作成日時                  |
| `slackUserId` | TEXT      | Slack のユーザー ID       |
| `updatedAt`   | TIMESTAMP | 更新日時                  |
| `workspaceId` | TEXT      | ワークスペースの ID       |
| `userId`      | UUID      | Supabase Auth の `userId` |

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
2. フォーム入力（タイトル・期日・担当者など）zod でレギュレーションの設定有
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
