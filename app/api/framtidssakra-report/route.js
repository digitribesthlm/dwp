import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.WEBHOOK_FUTURE_REPORT;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const firstName = body?.firstName?.trim();
    const email = body?.email?.trim();

    if (!firstName || !email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Förnamn och giltig e-postadress måste anges.' },
        { status: 400 }
      );
    }

    if (!body?.consent) {
      return NextResponse.json({ error: 'Samtycke krävs.' }, { status: 400 });
    }

    if (!WEBHOOK_URL) {
      console.error('WEBHOOK_FUTURE_REPORT saknas i miljövariablerna');
      return NextResponse.json(
        { error: 'Webhook saknas. Kontakta support.' },
        { status: 500 }
      );
    }

    const payload = {
      firstName,
      lastName: body?.lastName?.trim() || null,
      company: body?.company?.trim() || null,
      phone: body?.phone?.trim() || null,
      email,
      note: body?.note?.trim() || null,
      consent: Boolean(body?.consent),
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      source: 'framtidssakra-report',
    };

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Report webhook error:', errorText);
      return NextResponse.json(
        { error: 'Kunde inte skicka beställningen just nu.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Framtidssäkra report error:', error);
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen senare.' },
      { status: 500 }
    );
  }
}

