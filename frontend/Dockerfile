#  Stage 1: Build 
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Delete package-lock.json and reinstall fresh for Linux
# This fixes the rolldown native binding issue
RUN rm -f package-lock.json && npm install

# Copy all source files
COPY . .

# Build args for Stripe key
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build the Vite app
RUN npm run build

#  Stage 2: Serve 
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]