# Kino App – Paigaldusjuhend

Nõuete link, Confulence'is: https://tptlive-team-iocjhipz.atlassian.net/wiki/x/BACeAg 

## Eeltingimused

Veendu, et sul on järgmised tööriistad paigaldatud:

- **[Bun](https://bun.sh/)** – JavaScripti runtime ja paketihaldur  
- **MariaDB** – andmebaasiserver

---

## Paigaldamine

1. **Paigalda sõltuvused**  
   Ava terminal projekti juurkataloogis ja käivita:
   ```bash
   bun i
   bunx prisma migrate dev
   bunx prisma generate
   bunx prisma db seed

2. scriptid jooksutavad jooksva protessi terminalis.
   ```bash
   bun run dev
   ---
   bun run dev-server
