'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialState = {
  firstName: '',
  lastName: '',
  company: '',
  phone: '',
  email: '',
  note: '',
  consent: false,
};

export default function ReportForm() {
  const [fields, setFields] = useState(initialState);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: null, message: '' });

    if (!fields.firstName.trim() || !fields.email.trim()) {
      setStatus({ type: 'error', message: 'Fyll i förnamn och e-post.' });
      return;
    }
    if (!fields.consent) {
      setStatus({ type: 'error', message: 'Godkänn att vi får kontakta dig.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/framtidssakra-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Kunde inte skicka beställningen.');
      }

      setStatus({
        type: 'success',
        message: 'Tack! Rapporten skickas till dig inom kort.',
      });
      setFields(initialState);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Något gick fel. Försök igen senare.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-900">
          Förnamn*
          <input
            type="text"
            value={fields.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Sandra"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-900">
          Efternamn
          <input
            type="text"
            value={fields.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Eriksson"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-900">
        Företag / organisation
        <input
          type="text"
          value={fields.company}
          onChange={(event) => updateField('company', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Digi Growth"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-900">
          Telefon
          <input
            type="tel"
            value={fields.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="+46 70 123 45 67"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-900">
          E-post*
          <input
            type="email"
            value={fields.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="namn@foretag.se"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-900">
        Vad tror du blir viktigast 2026? (valfritt)
        <textarea
          rows={3}
          value={fields.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Ex. hyper-personalisering, AI-chatt, vertikal video..."
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={fields.consent}
          onChange={(event) => updateField('consent', event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          Jag godkänner att Digi Growth får kontakta mig om rapporten och relaterade tjänster. Läs mer i vår
          integritetspolicy.
        </span>
      </label>

      {status.message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Skickar...' : 'Beställ rapporten'}
      </button>
      <p className="text-xs text-gray-500">
        Vi skyddar din data och använder den endast för att skicka rapporten och uppföljande insikter.
        Läs mer i vår{' '}
        <Link href="/integritetspolicy/" className="text-blue-600 hover:underline font-semibold">
          integritetspolicy
        </Link>{' '}
        och{' '}
        <Link href="/cookies-integritet/" className="text-blue-600 hover:underline font-semibold">
          cookiepolicy
        </Link>
        .
      </p>
    </form>
  );
}

