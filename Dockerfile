FROM node:24.14.1-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b
# https://martinheinz.dev/blog/92 yes, this is an alpine image but im not concerned about the issues outline in this blog for this assignment
WORKDIR /api
COPY api/package*.json ./
RUN npm install express sequelize sqlite3 jsonwebtoken ajv
COPY api/ .
EXPOSE 3000
CMD ["node", "app.js"]
