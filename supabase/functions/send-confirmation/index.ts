// Supabase Edge Function: send-confirmation
// Sends Appathon emails via Resend. Deploy with:
//   supabase functions deploy send-confirmation
//   supabase secrets set RESEND_API_KEY=... RESEND_FROM="Appathon <noreply@appthon.in>"
// The RESEND_API_KEY lives ONLY here (server-side). Never in frontend code.
// The frontend calls this with supabase.functions.invoke('send-confirmation', ...)
// and records the result in the Admin > Emails log (queued vs sent).

// @ts-ignore - Deno runtime imports
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM = Deno.env.get('RESEND_FROM') ?? 'Appathon <noreply@appthon.in>'

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405 })
  }
  try {
    const { type, to, subject, body } = await req.json()
    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'to, subject and body are required' }), { status: 400 })
    }
    if (!RESEND_API_KEY) {
      // Honest failure: the caller keeps the email "queued" in Admin.
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured' }), { status: 500 })
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        text: body,
        tags: [{ name: 'type', value: String(type ?? 'confirmation') }],
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), { status: res.status })
    }
    return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
