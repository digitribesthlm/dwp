import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.WEBHOOK_HOMEPAGE_EVALUATION;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trafficSourcesLimit = 10;

const sanitizeCompetitors = (competitors) =>
  (Array.isArray(competitors) ? competitors : [])
    .slice(0, 3)
    .map((competitor) => ({
      name: competitor?.name?.trim(),
    }))
    .filter((competitor) => competitor.name);

const sanitizeTrafficSources = (sources) =>
  (Array.isArray(sources) ? sources : [])
    .map((source) => String(source).trim())
    .filter(Boolean)
    .slice(0, trafficSourcesLimit);

export async function POST(request) {
  try {
    const body = await request.json();
    const domain = body?.domain?.trim();
    const email = body?.email?.trim();
    const notes = body?.notes?.trim();
    const competitors = sanitizeCompetitors(body?.competitors);
    const trafficSources = sanitizeTrafficSources(body?.trafficSources);

    if (!domain) {
      return NextResponse.json({ error: 'Domän krävs.' }, { status: 400 });
    }

    if (!competitors.length) {
      return NextResponse.json(
        { error: 'Minst en konkurrent behövs för att göra jämförelsen.' },
        { status: 400 }
      );
    }

    if (!trafficSources.length) {
      return NextResponse.json(
        { error: 'Markera minst en trafikkälla för att vi ska kunna göra analysen.' },
        { status: 400 }
      );
    }

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress.' }, { status: 400 });
    }

    if (!WEBHOOK_URL) {
      console.error('WEBHOOK_HOMEPAGE_EVALUATION saknas i miljövariablerna');
      return NextResponse.json(
        { error: 'Webhook ej konfigurerad. Kontakta support.' },
        { status: 500 }
      );
    }

    const payload = {
      domain,
      email,
      notes: notes || null,
      competitors,
      trafficSources,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      source: 'homepage-evaluation',
    };

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const text = await webhookResponse.text();
      console.error('Webhook error:', text);
      return NextResponse.json(
        { error: 'Kunde inte skicka förfrågan just nu.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Homepage evaluation error:', error);
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen senare.' },
      { status: 500 }
    );
  }
}

