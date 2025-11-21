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
   bunx prisma migrate dev
   bunx prisma generate
   bunx prisma db seed

must run these two as seperate processes, e.g in seperate terminal windows
   ```bash
   bun run dev
---
   bun run dev-server
