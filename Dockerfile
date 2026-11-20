# syntax=docker/dockerfile:1
#
# Stages
#   build    install deps (npm ci once package-lock.json is committed) + tsc -b + vite build -> dist/
#   runtime  unprivileged nginx (non-root, port 8080) serving dist/ and proxying /api + /socket.io
#
# The backend address is NOT baked into the image: set BACKEND_UPSTREAM at run time
# (docker/nginx/default.conf.template is rendered by the nginx entrypoint on start).
# VITE_* variables ARE baked at build time - they are public, never put secrets in them.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
ENV BACKEND_UPSTREAM=http://backend:4000
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1 || exit 1
