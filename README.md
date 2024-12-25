# remix-words-funny

A fullstack English words study website built with [remix-t3-stack](https://github.com/SteveSuv/remix-t3-stack)

# features

- end-to-end type safe by `trpc`
- get `myUserInfo` anywhere by `useMyUserInfo`
- type safe form with `zod` by `useZodForm`
- no need to export `action` in routes, just call `trpcClient.action` to mutate anywhere
- request with permission controll by `trpc middlewares`
- deploy by `docker`
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
- jotai
- pnpm
- react-hook-form
- react-query
- next-themes
- lucide-icons
- zod
- docker

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
- first run command below to create a local postgres container (you can replace the POSTGRES_PASSWORD_EXAMPLE):

```sh
docker run -d --name postgres -p 5432:5432 -v postgres_data:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=POSTGRES_PASSWORD_EXAMPLE -e POSTGRES_DB=wordsfunny postgres:16-alpine
```

- run command `pnpm db:push` to sync db structs and drizzle schema
- download csv data file: https://mypikpak.com/s/VOEs95bTB0KGAg75t0Nrs-oOo1
- use your favorite db tool like [TablePlus](https://tableplus.com/) to connect the postgres db
- insert db data by import csv files to tables. Notice! you should first import `Book`, then `Word`, then others, because tables have some relations.
- run `pnpm db:task`, if print `total words count: 152543` means the postgres db is running ok

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

- when you dev local, you should run `docker stop wordsfunny` first to stop container to avoid port occupation
- words resource [repo](https://github.com/kajweb/dict)
- more features will be added gradually
