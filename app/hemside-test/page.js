import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getHomepageData } from '@/lib/api';
import { buildNavigationData, siteConfig } from '@/lib/siteConfig';
import EvaluationWizard from './EvaluationWizard';

export const metadata = {
  title: `Testa din hemsida | ${siteConfig.name}`,
  description:
    'Få en snabb rapport över din hemsida, dina konkurrenters trafikkällor och rekommendationer direkt i inkorgen.',
  alternates: {
    canonical: '/hemside-test/',
  },
};

export default async function HomepageEvaluationPage() {
  const homepageData = await getHomepageData();
  const navigation = buildNavigationData(homepageData);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow bg-gray-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-400 blur-[120px]" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <p className="text-xs font-semibold tracking-[0.4em] uppercase text-blue-200">
              Hemsidesdiagnos
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
              Testa din hemsida mot konkurrenterna – få rapport inom 24h
            </h1>
            <p className="mt-4 text-lg text-gray-200 leading-relaxed max-w-3xl">
              Vi gör en snabb jämförelse av din webbplats mot upp till tre konkurrenter. Du
              får insikter om budskap, konverteringsflöden, annonser och vilka trafikkällor
              som driver resultat just nu.
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-gray-200 md:grid-cols-3">
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                ✔️ Tekniska och kommersiella signaler
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                ✔️ Konkurrenternas trafikkällor
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                ✔️ Rekommenderat nästa steg
              </li>
            </ul>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.35em] text-blue-600 uppercase">
                Trestegsprocess
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                Besvara tre frågor – få en trendrapport med rekommendationer
              </h2>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Vi hämtar offentliga data, annonsbibliotek, sökresultat och mjuka signaler från
                webbplatsen. Det ger dig en snabb nulägesbild innan vi bokar nästa samtal.
              </p>
            </div>
            <EvaluationWizard />
            <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-200 p-6 md:p-10 shadow-xl">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Vad du får med rapporten
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-700">
                    <li>• Kort prioriteringslista över hinder på webbplatsen</li>
                    <li>• Insikt i konkurrenternas budskap och CTA:er</li>
                    <li>• Trafik- och annonsöversikt (Google, Meta, LinkedIn m.fl.)</li>
                    <li>• Rekommenderad CRO- och funnel-strategi</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Integritet
                  </p>
                  <p className="mt-3 text-gray-700 text-sm">
                    Vi använder endast data som är publik eller som du ger oss tillåtelse att
                    analysera. Rapporterna skickas via säkra kanaler och sparas max 30 dagar.
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    Vill du hellre prata direkt? Hör av dig på{' '}
                    <a
                      href={`mailto:${homepageData?.footer?.company?.contact?.email || siteConfig.contactEmail}`}
                      className="text-blue-600 font-semibold"
                    >
                      {homepageData?.footer?.company?.contact?.email || siteConfig.contactEmail}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}


