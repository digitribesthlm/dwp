'use client';

import { useState } from 'react';

const maxCompetitors = 3;

const trafficOptions = [
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta (Facebook/Instagram)' },
  { value: 'linkedin_ads', label: 'LinkedIn Ads' },
  { value: 'seo', label: 'Organisk sök/SEO' },
  { value: 'email', label: 'Nyhetsbrev/Email' },
  { value: 'other', label: 'Övriga källor' },
];

const steps = [
  {
    title: 'Din webbplats',
    description:
      'Ange domänen du vill analysera. Vi kontrollerar tekniska signaler, budskap och konverteringsflöden.',
  },
  {
    title: 'Konkurrenter',
    description:
      'Lägg till upp till tre konkurrenter vi ska ställa mot. Räcker med domän eller företagsnamn.',
  },
  {
    title: 'Trafikkällor just nu',
    description:
      'Markera var ni syns idag. Det hjälper oss att förstå nuvarande mix (annonser, SEO, e-post m.m.).',
  },
  {
    title: 'Leverans & rapport',
    description: 'Vi skickar rapporten till din inkorg och delar rekommenderat nästa steg.',
  },
];

const createCompetitor = () => ({
  id: Math.random().toString(36).slice(2, 10),
  name: '',
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EvaluationWizard() {
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState('');
  const [competitors, setCompetitors] = useState([createCompetitor()]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const normalizedCompetitors = competitors.map((competitor) => ({
    ...competitor,
    name: competitor.name?.trim(),
  }));

  const hasAtLeastOneCompetitor = normalizedCompetitors.some((competitor) => competitor.name);
  const hasTrafficSources = trafficSources.length > 0;

  const canProceed = () => {
    if (step === 0) {
      return Boolean(domain.trim());
    }
    if (step === 1) {
      return hasAtLeastOneCompetitor;
    }
    if (step === 2) {
      return hasTrafficSources;
    }
    if (step === 3) {
      return emailPattern.test(email.trim());
    }
    return false;
  };

  const handleNext = () => {
    if (canProceed() && step < steps.length - 1) {
      setStep(step + 1);
      setStatus({ type: null, message: '' });
    }
  };

  const handleBack = () => {
    setStep(Math.max(0, step - 1));
    setStatus({ type: null, message: '' });
  };

  const updateCompetitor = (index, updated) => {
    setCompetitors((prev) =>
      prev.map((competitor, idx) => (idx === index ? { ...competitor, ...updated } : competitor))
    );
  };

  const toggleTrafficSource = (source) => {
    setTrafficSources((prev) =>
      prev.includes(source) ? prev.filter((item) => item !== source) : [...prev, source]
    );
  };

  const handleAddCompetitor = () => {
    if (competitors.length < maxCompetitors) {
      setCompetitors((prev) => [...prev, createCompetitor()]);
    }
  };

  const handleRemoveCompetitor = (index) => {
    if (competitors.length === 1) {
      updateCompetitor(0, { name: '' });
      return;
    }
    setCompetitors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!canProceed() || isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const payload = {
      domain: domain.trim(),
      competitors: normalizedCompetitors
        .filter((competitor) => competitor.name)
        .map((competitor) => ({
          name: competitor.name,
        })),
      email: email.trim(),
      notes: notes.trim(),
      trafficSources,
    };

    try {
      const response = await fetch('/api/homepage-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Kunde inte skicka rapporten');
      }

      setStatus({
        type: 'success',
        message: 'Tack! Vi har mottagit din förfrågan och levererar rapporten inom 24 timmar.',
      });
      setStep(0);
      setDomain('');
      setCompetitors([createCompetitor()]);
      setTrafficSources([]);
      setEmail('');
      setNotes('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Något gick fel. Försök igen om en liten stund.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-gray-900">Din domän*</span>
            <input
              type="text"
              value={domain}
              placeholder="exempel.se"
              onChange={(event) => setDomain(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <p className="text-sm text-gray-600">
            Vi analyserar konverteringsresa, kärnbudskap, teknisk struktur och vilka CTA:er som driver möten idag.
          </p>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-6">
          {competitors.map((competitor, index) => (
            <div
              key={competitor.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-900">
                      Konkurrent {index + 1} {index === 0 ? '*' : ''}
                    </span>
                    <input
                      type="text"
                      value={competitor.name}
                      placeholder="konkurrent.se eller företagsnamn"
                      onChange={(event) => updateCompetitor(index, { name: event.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCompetitor(index)}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:text-red-500"
                  aria-label="Ta bort konkurrent"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddCompetitor}
              disabled={competitors.length >= maxCompetitors}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              + Lägg till fler konkurrenter
            </button>
            <p className="text-xs text-gray-500">Max {maxCompetitors} konkurrenter</p>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Markera de kanaler ni använder idag. Vi använder dem för att se hur mixen skiljer sig mot
            konkurrenterna och identifiera hål i tratten.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {trafficOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  trafficSources.includes(option.value)
                    ? 'border-blue-200 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={trafficSources.includes(option.value)}
                  onChange={() => toggleTrafficSource(option.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900">Översikt</h4>
          <dl className="mt-3 space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <dt className="font-medium text-gray-500">Domän</dt>
              <dd className="text-gray-900">{domain || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Konkurrenter</dt>
              <dd className="mt-1 space-y-2">
                {normalizedCompetitors.filter((competitor) => competitor.name).map((competitor) => (
                  <div key={competitor.id} className="rounded-xl bg-gray-50 px-4 py-2">
                    <p className="font-semibold text-gray-900">{competitor.name}</p>
                  </div>
                ))}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500">Trafikkällor</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {trafficSources.length > 0 ? (
                  trafficSources.map((source) => {
                    const option = trafficOptions.find((item) => item.value === source);
                    return (
                      <span
                        key={source}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                      >
                        {option?.label || source}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-500">Inga källor markerade</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-900">Rapport till*</span>
          <input
            type="email"
            value={email}
            placeholder="namn@företag.se"
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-900">Önskemål eller fokus (valfritt)</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Berätta vad du vill att vi tittar extra på (t.ex. CRO, text, annonser)."
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {steps.map((wizardStep, index) => (
            <div key={wizardStep.title} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  index <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-600">
            Steg {step + 1} av {steps.length}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{steps[step].title}</h3>
          <p className="text-gray-600 mt-1">{steps[step].description}</p>
        </div>
      </div>

      {renderStepContent()}

      {status.message && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900 sm:w-auto"
          >
            Tillbaka
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 sm:w-auto"
          >
            Nästa steg
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 sm:w-auto"
          >
            {isSubmitting ? 'Skickar...' : 'Skicka rapporten'}
          </button>
        )}
      </div>
    </div>
  );
}

