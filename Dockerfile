# Etapa 1: Build de la app
FROM node:20-alpine as builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Nginx
FROM nginx:alpine

# Copia los archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script de entrada que crea env.js con variables del entorno
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]