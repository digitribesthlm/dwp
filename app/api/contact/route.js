import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.CONTACT_FORM_WEBHOOK;

// Simple in-memory rate limiting (resets on server restart)
const submissionTracker = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const submissions = submissionTracker.get(ip) || [];
  
  // Remove old submissions outside the time window
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissionTracker.set(ip, recentSubmissions);
  return true;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'För många förfrågningar. Vänligen försök igen om en minut.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { name, email, phone, message, honeypot, timestamp } = body;
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      return NextResponse.json(
        { success: false, message: 'Spam detected.' },
        { status: 400 }
      );
    }
    
    // Timestamp check - form should take at least 2 seconds to fill
    if (timestamp) {
      const timeTaken = Date.now() - parseInt(timestamp);
      if (timeTaken < 2000) {
        return NextResponse.json(
          { success: false, message: 'Formuläret skickades för snabbt.' },
          { status: 400 }
        );
      }
    }
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Vänligen fyll i alla obligatoriska fält.' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Vänligen ange en giltig e-postadress.' },
        { status: 400 }
      );
    }
    
    // Check if webhook URL is configured
    if (!WEBHOOK_URL) {
      console.error('CONTACT_FORM_WEBHOOK is not configured');
      return NextResponse.json(
        { success: false, message: 'Formuläret är inte korrekt konfigurerat.' },
        { status: 500 }
      );
    }
    
    // Prepare data for webhook
    const webhookData = {
      name,
      email,
      phone: phone || 'Ej angiven',
      message,
      submittedAt: new Date().toISOString(),
      ip
    };
    
    // Send to webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (!webhookResponse.ok) {
      console.error('Webhook error:', await webhookResponse.text());
      return NextResponse.json(
        { success: false, message: 'Ett fel uppstod vid skickandet. Försök igen senare.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Tack för ditt meddelande! Vi återkommer så snart som möjligt.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Ett oväntat fel uppstod. Försök igen senare.' },
      { status: 500 }
    );
  }
}
