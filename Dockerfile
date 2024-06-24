FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN  npm install pnpm -g && pnpm config set registry https://registry.npmmirror.com

RUN  pnpm install

COPY . .

RUN npm run pro

FROM nginx:alpine

COPY --from=builder /app/dist ./disk

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
