import nodemailer from 'nodemailer'

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

const envEnabled = Boolean(SMTP_HOST && SMTP_PORT && SMTP_FROM)
let cachedTransporter: nodemailer.Transporter | null = null

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  if (envEnabled) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
    return cachedTransporter
  }

  // Dev fallback: create an Ethereal test account automatically
  const testAccount = await nodemailer.createTestAccount()
  cachedTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
  console.info('[mailer] Using Ethereal test SMTP. Preview at:', 'https://ethereal.email/messages')
  return cachedTransporter
}

export type ReservationEmailPayload = {
  to: string
  filmTitle: string
  theatreName: string
  hallName: string
  datetime: string
  seats: { id: number; row: string; column: number; type: string }[]
  orderId: string
}

async function sendReservationEmail(payload: ReservationEmailPayload) {
  const transporter = await getTransporter()
  const from = SMTP_FROM || 'kino@example.com'

  const seatList =
    payload.seats.map((s) => `Rida ${s.row}, koht ${s.column} (${s.type})`).join('\n') ||
    'Istmed valimata'
  const text = `Tere!\n\nSinu broneering on salvestatud.\n\nFilm: ${payload.filmTitle}\nKino: ${payload.theatreName}\nSaal: ${payload.hallName}\nAeg: ${payload.datetime}\nTellimus: ${payload.orderId}\n\nIstmed:\n${seatList}\n\nKohtad on hoitud 15 minutit. Kohtume kinos!`

  const info = await transporter.sendMail({
    from,
    to: payload.to,
    subject: `Broneering kinnitatud: ${payload.filmTitle}`,
    text,
  })

  if (!envEnabled) {
    console.info('[mailer] Test message preview URL:', nodemailer.getTestMessageUrl(info))
  }

  return { sent: true as const, previewUrl: nodemailer.getTestMessageUrl(info) }
}

export const mailer = {
  sendReservationEmail,
  enabled: envEnabled,
}

export default mailer
