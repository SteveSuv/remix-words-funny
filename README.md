# remix-words-funny

English words study website built with [remix-t3-stack](https://github.com/SteveSuv/remix-t3-stack)

# features

- end-to-end type safe by `trpc`
- get `myUserInfo` anywhere by `useMyUserInfo`
- type safe form with `zod` by `useZodForm`
- no need to export `action` in routes, just call `trpcClient.action` to mutate anywhere
- request with permission controll by `trpc middlewares`
- deploy by `docker compose`
- support dark mode by `useAppTheme`
- use `drizzle` to keep type safe with `postgresql` db
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
- postgresql
- jwt
- pnpm
- react-hook-form
- react-query
- next-themes
- lucide-icons
- zod
- docker compose

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

- install [docker](https://www.docker.com/get-started/) and start docker service
- first run `docker compose up -d` to create a postgres container
- sync db structs by command `pnpm db:push`
- download csv data file: https://mypikpak.com/s/VOEs95bTB0KGAg75t0Nrs-oOo1
- use your favorite db tool like [TablePlus](https://tableplus.com/) to connect the postgres db
- import db data by upload csv files
- then run `pnpm deploy` it will open the website automatically

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

```
pnpm deploy
```

# notice

- when you dev local, you should run `docker compose down` first to stop docker container to avoid port occupation
- words resource [repo](https://github.com/kajweb/dict)
- more features will be added gradually
