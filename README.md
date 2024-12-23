# remix-words-funny

English words study website built with [remix-t3-stack](https://github.com/SteveSuv/remix-t3-stack)

# features

- end-to-end type safe by `trpc`
- get `myUserInfo` anywhere by `useMyUserInfo`
- type safe form with `zod` by `useZodForm`
- no need to export `action` in routes, just call `trpcClient.action` to mutate anywhere
- request with permission controll by `trpc middlewares`
- deploy to `docker` or `vercel`
- support dark mode by `useAppTheme`
- use `prisma` to keep type safe with db
- toast request error automatically
- always use latest remix (react-router v7) features

# stack

- remix (react-router v7)
- vite
- trpc
- tailwindcss
- nextui
- typescript
- drizzle
- jwt
- pnpm
- react-hook-form
- react-query
- next-themes
- lucide-icons
- zod
- docker
- vercel

# how to dev

1. clone this repository

```
git clone git@github.com:SteveSuv/remix-words-funny.git
```

2. install packages

```
npm i pnpm -g
pnpm i
```

3. init database

```
pnpm db:push
```

4. run dev server

```
pnpm dev
```

5. build and preview

```
pnpm build
pnpm start
```

# how to deploy

- deploy to docker

```
pnpm deploy
```

- deploy to vercel: follow this [guide](https://vercel.com/docs/frameworks/remix)

# notice
