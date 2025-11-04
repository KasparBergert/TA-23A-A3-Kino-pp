FROM oven/bun:latest

WORKDIR /app 

COPY . .

RUN bun i
RUN apt-get update -y && apt-get install -y netcat-openbsd
CMD ["sh", "./server.sh"]
