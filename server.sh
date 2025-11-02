#!/bin/sh

# This is only for the docker image
bun run dev --host 0.0.0.0 &

echo "Waiting for datbase to be ready"
until nc -z db 3306; do
 sleep 1
done

bunx prisma db push
bunx prisma generate
bunx prisma db seed

bun run dev-server --host 0.0.0.0
