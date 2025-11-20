import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/siteConfig';

export const metadata = {
  title: `Cookiepolicy | ${siteConfig.name || 'Digigrowth'}`,
  description: 'Information om hur vi använder cookies på vår webbplats.',
  alternates: {
    canonical: '/cookie/',
  },
};

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cookiepolicy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
              Information om hur vi använder cookies och liknande tekniker på vår webbplats
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 hover:prose-a:underline
              prose-ul:text-gray-700 prose-li:mb-2
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4">
              
              <h2>Vad är cookies?</h2>
              <p>
                Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. 
                De hjälper webbplatsen att komma ihåg dina preferenser och förbättra din användarupplevelse.
              </p>

              <h2>Hur använder vi cookies?</h2>
              <p>
                Vi använder cookies för att:
              </p>
              <ul>
                <li>Förbättra webbplatsens funktionalitet och prestanda</li>
                <li>Analysera hur besökare använder vår webbplats</li>
                <li>Komma ihåg dina preferenser och inställningar</li>
                <li>Förstå hur våra marknadsföringsinsatser fungerar</li>
              </ul>

              <h2>Typer av cookies vi använder</h2>
              
              <h3>Nödvändiga cookies</h3>
              <p>
                Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. 
                De kan inte stängas av i våra system.
              </p>

              <h3>Analyscookies</h3>
              <p>
                Vi använder analyscookies för att förstå hur besökare interagerar med vår webbplats. 
                Detta hjälper oss att förbättra användarupplevelsen.
              </p>

              <h3>Marknadsföringscookies</h3>
              <p>
                Dessa cookies används för att visa relevant reklam och mäta effektiviteten av våra 
                marknadsföringskampanjer.
              </p>

              <h2>Hantera cookies</h2>
              <p>
                Du kan när som helst ändra dina cookie-inställningar genom din webbläsare. 
                Observera att om du blockerar vissa cookies kan det påverka funktionaliteten på vår webbplats.
              </p>
              <p>
                Läs mer om hur du hanterar cookies i din webbläsare:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/sv/kb/aktivera-och-inaktivera-kakor" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/sv-se/microsoft-edge/ta-bort-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>

              <h2>Uppdateringar av denna policy</h2>
              <p>
                Vi kan komma att uppdatera denna cookiepolicy från tid till annan. 
                Eventuella ändringar publiceras på denna sida.
              </p>

              <h2>Kontakta oss</h2>
              <p>
                Om du har frågor om vår användning av cookies, vänligen kontakta oss på{' '}
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
