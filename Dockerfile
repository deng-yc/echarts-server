FROM node:8

# 安装canvas环境
RUN apt-get update && apt-get install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /var/app_home

# 安装依赖
COPY ./package*.json ./
# If you are building your code for production
# RUN npm install --only=production
RUN npm install

# 复制文件
COPY . .

EXPOSE 3000

# 设置启动命令
CMD [ "npm", "start" ]
