# kino app

1. installi bun

2. tee `bun i` projekti root kataloogis

3. installi mariadb ja pane käima oma arvuitl

4. muuda root kasutaja password ära selleks mis on defineeritud .env failis.

5. scriptid mida jookutada paraleelselt
`
bun i
bun run db:init
bun run dev
bun run dev-server
`


