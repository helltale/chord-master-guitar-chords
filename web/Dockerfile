FROM node:20.19.0-alpine AS builder

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npx vite build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
