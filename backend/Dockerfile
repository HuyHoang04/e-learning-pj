# Giai đoạn 1: Xây dựng ứng dụng
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Sao chép package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt tất cả các dependencies (bao gồm devDependencies để build và generate Prisma client)
RUN yarn install --frozen-lockfile

# Sao chép toàn bộ mã nguồn của ứng dụng (bao gồm schema của Prisma)
COPY . .

# Generate Prisma Client (Prisma CLI có sẵn từ devDependencies)
# Điều này đảm bảo client được tạo với schema mới nhất.
RUN yarn prisma generate

# Build ứng dụng NestJS
RUN yarn build

# Giai đoạn 2: Tạo image production
FROM node:22-alpine

WORKDIR /usr/src/app

# Thiết lập môi trường NODE_ENV là production
ENV NODE_ENV=production

# Sao chép package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt chỉ các dependencies cần thiết cho production
RUN yarn install --frozen-lockfile --production

# Sao chép Prisma client đã được generate từ giai đoạn builder
# Điều này quan trọng để Prisma client hoạt động chính xác trong production.
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Sao chép thư mục 'dist' chứa code đã build từ giai đoạn builder
COPY --from=builder /usr/src/app/dist ./dist

# Sao chép tệp .env
# QUAN TRỌNG: Đối với môi trường production, cách tốt hơn là quản lý các biến môi trường
# thông qua cơ chế của Docker (ví dụ: cờ -e, docker-compose.yml, hoặc Kubernetes secrets)
# thay vì sao chép trực tiếp tệp .env vào image.
# Tuy nhiên, nếu bạn muốn build image với một tệp .env cụ thể, dòng này sẽ thực hiện điều đó.
COPY .env ./.env

# Mở port mà ứng dụng sẽ chạy
# Từ main.ts: const port = process.env.PORT || 10000;
EXPOSE 10000

# Lệnh để chạy ứng dụng
# Từ package.json "start:prod": "node dist/main"
CMD ["node", "dist/main.js"]