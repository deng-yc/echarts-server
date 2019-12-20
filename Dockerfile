FROM node:8

# 安装canvas环境

# 设置工作目录
WORKDIR /var/app_home

# 安装依赖
COPY ./package*.json ./
# If you are building your code for production
# RUN npm install --only=production

# 复制文件
COPY . .

EXPOSE 3000

# 设置启动命令
CMD [ "npm", "start" ]
