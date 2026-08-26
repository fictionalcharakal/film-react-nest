FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ARG VITE_CDN_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3.19
COPY --from=build /app/dist /frontend-dist
CMD ["sh", "-c", "cp -r /frontend-dist/. /usr/share/nginx/html/ && echo 'Frontend build copied to volume'"]