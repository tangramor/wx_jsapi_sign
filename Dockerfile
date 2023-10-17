FROM redis:latest

# node:18

ENV COMPANY_NAME="Beijing Dream Castle Culture Co., Ltd"
ENV PROJECT_NAME=梦之城微信控制中心
ENV SYSTEM_EMAIL=xxx@a-li.com.cn
ENV CRYPTO_KEY=k4yb0ardc4x
ENV LOCAL_SOURCE=dreamcastle
ENV APP_ID=wx9999999999
ENV APP_SECRET=ad73709c6e0815c999999999999

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get update -y && \
    apt-get install -y nodejs npm dumb-init
RUN npm install && \
    npm ci --omit=dev
EXPOSE 3000
CMD ["/usr/bin/dumb-init", "--", "bash", "start.sh"]