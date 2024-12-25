pnpm i
pnpm build
pnpm i --prod
docker stop wordsfunny-app
docker rm wordsfunny-app
docker rmi wordsfunny-image
docker build --platform linux/amd64 -t wordsfunny-image .
docker run --name wordsfunny-app -p 3000:3000 -d wordsfunny-image
docker image prune -f
sleep 3
open http://localhost:3000
