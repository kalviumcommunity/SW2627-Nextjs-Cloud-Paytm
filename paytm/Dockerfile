FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/paytm"

ARG NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_RAZORPAY_KEY_ID

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]