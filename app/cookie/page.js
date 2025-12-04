import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getHomepageData } from '@/lib/api';
import { buildNavigationData, siteConfig } from '@/lib/siteConfig';

export const metadata = {
  title: `Integritet & Cookies | ${siteConfig.name || 'Your Site Name'}`,
  description: 'Allt om hur vi använder cookies och behandlar personuppgifter.',
  alternates: {
    canonical: '/cookie/',
  },
};

export default async function CookiePage() {
  const homepageData = await getHomepageData();
  const navigation = buildNavigationData(homepageData);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="uppercase tracking-[0.35em] text-blue-200 text-xs font-semibold mb-3">
              Integritet
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cookiepolicy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
              Här beskriver vi hur vi använder cookies och behandlar personuppgifter när du beställer analyser och rapporter.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <article className="rich-text-content max-w-none">
              <h2>1. Inledning</h2>
              <p>
                Välkommen till Digi Growth Media! Vi värnar om din personliga integritet och strävar efter att skydda dina personuppgifter på bästa sätt.
                Denna policy förklarar hur vi samlar in, använder, delar och skyddar dina uppgifter när du besöker vår webbplats och använder våra tjänster,
                särskilt när du beställer en kostnadsfri analys eller laddar ned våra rapporter.
              </p>

              <h2>2. Vem är ansvarig för dina personuppgifter?</h2>
              <p>
                Digi Growth Media<br />
                Kungsholmen • Jaktvarvsplan 3<br />
                Stockholm, Sweden<br />
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail || 'integritet@digigrowth.se'}</a>
              </p>
              <p>Digi Growth Media är personuppgiftsansvarig för behandlingen av dina personuppgifter.</p>

              <h2>3. Vilka uppgifter samlar vi in?</h2>
              <ul>
                <li>Uppgifter du frivilligt lämnar, t.ex. namn, e-post, telefon och företag.</li>
                <li>Hemsideadress och konkurrents domän för att kunna genomföra din beställda analys.</li>
                <li>Teknisk data som webbläsartyp och operativsystem för att förbättra säkerhet och upplevelse.</li>
              </ul>

              <h2>4. Varför samlar vi in uppgifterna?</h2>
              <ul>
                <li><strong>Tjänsteleverans:</strong> Skapa och skicka rapporter/analyser du beställt (laglig grund: avtal).</li>
                <li><strong>Kommunikation:</strong> Följa upp rapporten och presentera samarbetesförslag (laglig grund: berättigat intresse).</li>
                <li><strong>Marknadsföring:</strong> Utskick av nyhetsbrev efter uttryckligt samtycke (laglig grund: samtycke).</li>
                <li><strong>Utveckling:</strong> Analysera teknisk data för att förbättra webbplatsen (laglig grund: berättigat intresse).</li>
              </ul>

              <h2>5. Hur länge sparas uppgifterna?</h2>
              <p>
                Uppgifter kopplade till en analys sparas normalt i 12 månader efter leverans. Därefter raderas eller anonymiseras datan.
                Om du blir kund sparas information i enlighet med kundavtal och bokföringslagen.
              </p>

              <h2>6. Delning med tredje part</h2>
              <p>Vi säljer aldrig dina uppgifter. Vi använder enbart betrodda leverantörer för e-post, analys och lagring som följer GDPR och säkerhetskrav.</p>

              <h2>7. Dina rättigheter</h2>
              <ul>
                <li>Få tillgång till dina uppgifter (registerutdrag)</li>
                <li>Begära rättelse eller radering</li>
                <li>Invända mot behandling baserad på berättigat intresse</li>
                <li>Be om dataportabilitet</li>
                <li>Återkalla samtycke när som helst</li>
              </ul>
              <p>
                Kontakta oss på <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail || 'integritet@digigrowth.se'}</a>.
                Du kan även vända dig till Integritetsskyddsmyndigheten (IMY) vid klagomål.
              </p>
            </article>

            <article className="rich-text-content max-w-none">
              <h2>Cookies</h2>
              <p>
                Cookies är små textfiler som lagras i din webbläsare. Vi använder dem för att hemsidan ska fungera, för att analysera trafik och för att förbättra
                upplevelsen. Du kan hantera cookies i din webbläsare genom att rensa historik eller blockera spårning. Observera att vissa funktioner kan sluta fungera utan cookies.
              </p>
              <p>För detaljerade instruktioner, besök respektive webbläsares supportsida (Chrome, Firefox, Safari, Edge).</p>
            </article>
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}
