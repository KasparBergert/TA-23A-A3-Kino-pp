# Kino App – Paigaldusjuhend

Nõuete link, Confulencis: https://tptlive-team-iocjhipz.atlassian.net/wiki/x/BACeAg 

## Eeltingimused

Veendu, et sul on järgmised tööriistad paigaldatud:

- **[Bun](https://bun.sh/)** – JavaScripti runtime ja paketihaldur  
- **MariaDB** – andmebaasiserver

---

## Paigaldamine

1. **Installi Bun**  
   Järgi juhiseid aadressil [https://bun.sh/](https://bun.sh/).

2. **Paigalda sõltuvused**  
   Ava terminal projekti juurkataloogis ja käivita:
   ```bash
   bun i


bun i
bunx prisma migrate dev
bunx prisma generate
bunx prisma db seed
bun run dev
bun run dev-server
