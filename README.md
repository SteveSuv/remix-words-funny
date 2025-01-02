# remix-words-funny

A fullstack English words study website built with [remix-t3-stack](https://github.com/SteveSuv/remix-t3-stack)

![image](https://github.com/user-attachments/assets/6e57831f-9915-4f6f-9c2f-93040b0dcede)

# features

- end-to-end type safe by `trpc`
- get `myUserInfo` anywhere by `useMyUserInfo`
- type safe form with `zod` by `useZodForm`
- no need to export `action` in routes, just call `trpcClient.action` to mutate anywhere
- request with permission control by `trpc middlewares`
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
- first run command below to create a local postgres container (you can replace the `POSTGRES_PASSWORD_EXAMPLE`):

```sh
docker run -d --name postgres -p 5432:5432 -v postgres_data:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=POSTGRES_PASSWORD_EXAMPLE -e POSTGRES_DB=wordsfunny postgres:16-alpine
```

- run command `pnpm db:push` to sync db structs and drizzle schema
- download csv data file: https://mypikpak.com/s/VOEs95bTB0KGAg75t0Nrs-oOo1
- use your favorite db tool like [TablePlus](https://tableplus.com/) to connect the postgres db
- insert db data by import csv files to tables. Notice! you should first import `Book`, then `Word`, then others, because tables have some relations.
- run `pnpm db:task`, if print `total words count: 152543` means the postgres db is running ok

4. init email server (optional, if you don't want to send login verify code)

- when you dev local, you can just print the verify code simply
- when you deploy to prod, you can use some email server saas like [resend](https://resend.com/)
- or you can enable some email server's SMTP, then add `EMAIL_SERVER_ADDRESS` and `EMAIL_SERVER_PASS` to .env file, like [Netease Email](https://mail.163.com/) or [QQ Email](https://mail.qq.com/)

5. run dev server

```
pnpm dev
```

6. build and preview

```
pnpm build
pnpm start
```

# how to deploy

deploy by docker
```
pnpm run deploy
```

deploy by pm2
```
# push files to server
rsync -avz build node_modules package.json .env IP@HOST:~/remix-words-funny/

# ssh server and run app
ssh IP@HOST "cd ~/remix-words-funny && pm2 start npm -- start"
```

# notice

- suggest node version greater than 22
- when you dev local, you should run `docker stop wordsfunny-app` first to stop container to avoid port 3001 occupation
- words resource [repo](https://github.com/kajweb/dict)
- more features will be added gradually
- a more simply `remix-t3-stack` project for beginners is here: [remix-t3-stack](https://github.com/SteveSuv/remix-t3-stack)
