pnpm i
pnpm build
pnpm i --prod

docker stop wordsfunny-app
docker rm wordsfunny-app
docker rmi wordsfunny-image

docker build --platform linux/amd64 -t wordsfunny-image .
docker run --name wordsfunny-app -p 3001:3001 -d wordsfunny-image

sleep 3
open http://localhost:3001
