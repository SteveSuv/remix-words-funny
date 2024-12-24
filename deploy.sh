pnpm i
pnpm build
pnpm i --production
docker compose down
docker rmi wordsfunny
docker compose up -d
sleep 3
open http://localhost:3000
