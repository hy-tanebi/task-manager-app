```
.
├── components.json
├── docs
│   └── todo-spec.md
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20250316004430_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── README.md
├── src
│   ├── actions
│   │   ├── auth.ts
│   │   ├── send-slack-message-action.ts
│   │   ├── slackAuthService.ts
│   │   └── taskActions.ts
│   ├── app
│   │   ├── (auth)
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       ├── page.tsx
│   │   │       ├── success
│   │   │       └── verify
│   │   ├── api
│   │   │   ├── slack
│   │   │   │   ├── notify
│   │   │   │   ├── route.ts
│   │   │   │   └── send-message
│   │   │   └── tasks
│   │   │       └── [tasksId]
│   │   ├── components
│   │   │   ├── auth
│   │   │   │   ├── FormError.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── header
│   │   │   │   └── Header.tsx
│   │   │   ├── providers
│   │   │   │   └── ToastProvider.tsx
│   │   │   ├── SlackLoginButton.tsx
│   │   │   ├── task
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── TaskCreateButton.tsx
│   │   │   │   ├── TaskDetail.tsx
│   │   │   │   └── TaskForm.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskCardList.tsx
│   │   ├── error.tsx
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── tasks
│   │   │   └── [tasksId]
│   │   │       └── page.tsx
│   │   └── types
│   │       └── type.ts
│   ├── components
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── select.tsx
│   ├── favicon.ico
│   ├── lib
│   │   ├── prismaClient.ts
│   │   ├── supabase.js
│   │   └── utils.ts
│   └── schemas
│       └── index.ts
├── structure.md
├── structure.txt
├── tailwind.config.ts
├── tsconfig.json
└── utils
    └── supabase
        ├── client.ts
        ├── middleware.ts
        └── server.ts

34 directories, 61 files
```
