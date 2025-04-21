FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copia el build de Vite al directorio que Nginx sirve por defecto
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia una configuración de Nginx personalizada (opcional, te muestro un ejemplo abajo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
