// Vercel Serverless Function (alternative to the Supabase Edge Function).
// POST /api/send-email  { type, to, subject, body }
// Requires env vars on Vercel: RESEND_API_KEY, RESEND_FROM.
// The key is server-side only — the browser never sees it.
// If you use the Supabase Edge Function instead, you can delete this file.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const { to, subject, body } = req.body ?? {}
  if (!to || !subject || !body) return res.status(400).json({ error: 'to, subject and body are required' })
  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(500).json({ error: 'RESEND_API_KEY is not configured' })
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? 'Appathon <noreply@appthon.in>',
      to: [to],
      subject,
      text: body,
    }),
  })
  const data = await r.json()
  if (!r.ok) return res.status(r.status).json({ error: data })
  return res.status(200).json({ ok: true, id: data.id })
}
