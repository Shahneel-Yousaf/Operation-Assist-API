# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node:lts-gallium as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

RUN npm run build
RUN npm prune

FROM node:lts-gallium

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

RUN apt-get update \
  && apt-get install -y --no-install-recommends dialog \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "root:Docker!" | chpasswd \
  && apt-get install -y --no-install-recommends wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install --no-install-recommends -y google-chrome-stable fonts-noto-cjk fonts-open-sans fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY ./ops/ssh/sshd_config /etc/ssh/

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules

RUN node node_modules/puppeteer/install.mjs

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/templates ./templates

EXPOSE 3000

CMD [ "sh", "-c", "service ssh start && npm run migration:run:prod && node dist/src/main"]
