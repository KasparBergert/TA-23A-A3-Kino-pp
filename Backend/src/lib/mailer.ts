import nodemailer from 'nodemailer'

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

const enabled = Boolean(SMTP_HOST && SMTP_PORT && SMTP_FROM)

const transporter = enabled
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null

export type ReservationEmailPayload = {
  to: string
  filmTitle: string
  theatreName: string
  hallName: string
  datetime: string
  seats: { id: number; row: string; type: string }[]
  orderId: string
}

async function sendReservationEmail(payload: ReservationEmailPayload) {
  if (!enabled || !transporter) {
    console.info('[mailer] SMTP not configured; skipping email send')
    return { sent: false, reason: 'smtp_disabled' as const }
  }

  const seatList = payload.seats.map((s) => `Rida ${s.row} — iste #${s.id} (${s.type})`).join('\n') || 'Istmed valimata'
  const text = `Tere!\n\nSinu broneering on salvestatud.\n\nFilm: ${payload.filmTitle}\nKino: ${payload.theatreName}\nSaal: ${payload.hallName}\nAeg: ${payload.datetime}\nTellimus: ${payload.orderId}\n\nIstmed:\n${seatList}\n\nKohtad on hoitud 15 minutit. Kohtume kinos!`

  await transporter.sendMail({
    from: SMTP_FROM,
    to: payload.to,
    subject: `Broneering kinnitatud: ${payload.filmTitle}`,
    text,
  })

  return { sent: true as const }
}

export const mailer = {
  sendReservationEmail,
  enabled,
}

export default mailer
