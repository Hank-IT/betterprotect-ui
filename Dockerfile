FROM node:20-alpine as builder
ARG HANK_IT_NPM_REGISTRY_AUTH_TOKEN
ENV HANK_IT_NPM_REGISTRY_AUTH_TOKEN=$HANK_IT_NPM_REGISTRY_AUTH_TOKEN

RUN apk add zip

WORKDIR /app
COPY .npmrc /app/
COPY package*.json /app/

RUN npm ci

COPY ./ /app/

RUN npm run build-only

#
# Runner stage, runs the application in nginx
#
FROM nginx:stable-alpine as runner

COPY --from=builder /app/.docker/nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/