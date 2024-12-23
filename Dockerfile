FROM node:22-alpine

WORKDIR /app

ADD build build
ADD package.json package.json
ADD node_modules node_modules

ENV NODE_ENV="production"
ENV DATABASE_URL="postgresql://postgres.qvkvwfnbmuiaihrdpyye:ZL-WsWEC5vwn-*G@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
ENV JWT_SECRET="JWT_SECRET_EXAMPLE"
ENV CRYPTO_SECRET="CRYPTO_SECRET_EXAMPLE"
ENV PORT="3000"

EXPOSE 3000
CMD ["npm", "start"]