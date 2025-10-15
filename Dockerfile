# =========================
# 构建阶段
# =========================
FROM node:24-alpine AS build

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm install

# 复制项目源代码
COPY . .

# 构建产物
RUN npm run build

# =========================
# 生产阶段（极简）
# =========================
FROM node:24-alpine

WORKDIR /app

# 复制构建产物
COPY --from=build /app/.output ./.output

# 复制必要依赖文件
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client


ENV NITRO_PORT=3000

# 暴露端口（按项目端口调整）
EXPOSE 3000

# 启动命令
CMD ["node", ".output/server/index.mjs"]
