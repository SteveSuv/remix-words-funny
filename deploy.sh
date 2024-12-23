pnpm i
pnpm db:gen
pnpm build
pnpm i --production
docker build --platform linux/amd64 -t wordsfunny-image .
docker run --name wordsfunny -p 3000:3000 -d wordsfunny-image
docker image prune -f
open http://localhost:3000
