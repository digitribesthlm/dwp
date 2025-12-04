import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getHomepageData } from '@/lib/api';
import { buildNavigationData, siteConfig } from '@/lib/siteConfig';

export const metadata = {
  title: `Integritetspolicy | ${siteConfig.name}`,
  description:
    'Läs hur vi samlar in, använder och skyddar personuppgifter via kontaktformulär och rapportbeställningar.',
  alternates: {
    canonical: '/integritetspolicy/',
  },
};

const policySections = [
  {
    title: 'Vilken data använder vi?',
    items: [
      'WP-data: Vi hämtar publika texter, bilder och metadata från vårt WordPress-API för att visa innehåll. Inga personuppgifter lagras i frontenden.',
      'Formulärdata: Förnamn, efternamn, e-post, telefon, företag och frivilliga kommentarer som du delar med oss.',
    ],
  },
  {
    title: 'Varför samlar vi in data?',
    items: [
      'Svara på kontaktförfrågningar och boka möten.',
      'Skicka rapporter som “Framtidssäkra din marknadsföring – Trender 2026” och tala om hur du kan använda insikterna.',
      'Leverera hemside-testet (homepage evaluation) och återkoppla med rekommendationer.',
      'Skicka uppföljande tips kopplade till det innehåll du bett om, högst ett fåtal gånger per år.',
    ],
  },
  {
    title: 'Hur lagrar vi uppgifterna?',
    items: [
      'Formulär skickas via krypterade anslutningar och landar i vårt CRM med accessbegränsning. Vi säljer aldrig vidare information.',
      'Data lagras i Google Cloud (region EU Frankfurt) med redundanta backuper och rollbaserad åtkomst.',
      'Vi raderar uppgifter om du ber oss eller när underlaget inte längre behövs, dock senast efter 24 månader.',
    ],
  },
  {
    title: 'Dina rättigheter',
    items: [
      'Du kan när som helst begära utdrag, rättelse eller radering av dina uppgifter genom att mejla oss.',
      'Du kan avregistrera dig från alla utskick via länken i mejlet eller genom att kontakta oss direkt.',
      'Vill du återkalla ditt samtycke till AI-analysen eller rapporterna gör du det enklast via kontaktformuläret.',
    ],
  },
];

export default async function IntegritetspolicyPage() {
  const homepageData = await getHomepageData();
  const navigation = buildNavigationData(homepageData);
  const companyEmail = homepageData?.footer?.company?.contact?.email || siteConfig.contactEmail || null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <p className="text-xs font-semibold tracking-[0.35em] text-blue-600 uppercase mb-3">
              Integritet
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Integritetspolicy
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Vi värdesätter din integritet. Nedan beskriver vi vilken information vi använder inom vår headless
              WordPress/Next.js-plattform, hur den lagras och hur du kan påverka den.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {policySections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <article className="rounded-3xl border border-blue-100 bg-blue-50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
              <p className="text-gray-700 mb-4">
                Har du frågor om hur vi hanterar data eller vill du nyttja dina rättigheter? Kontakta oss så hjälper vi dig
                inom 72 timmar.
              </p>
              {companyEmail ? (
                <a
                  href={`mailto:${companyEmail}`}
                  className="inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Mejla {companyEmail}
                </a>
              ) : (
                <p className="text-sm text-gray-700">
                  Använd kontaktformuläret så återkommer vi inom 72 timmar.
                </p>
              )}
            </article>
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}

