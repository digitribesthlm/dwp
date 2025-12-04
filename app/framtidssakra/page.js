import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getHomepageData } from '@/lib/api';
import { buildNavigationData, siteConfig } from '@/lib/siteConfig';
import ReportForm from './ReportForm';

export const metadata = {
  title: `Framtidssäkra din marknadsföring | ${siteConfig.name}`,
  description:
    'Ladda ned rapporten ”5 steg för att framtidssäkra din marknadsföring – Trender 2026” och få en plan anpassad till ditt företag.',
  alternates: {
    canonical: '/framtidssakra/',
  },
};

export default async function FramtidssakraReportPage() {
  const homepageData = await getHomepageData();
  const navigation = buildNavigationData(homepageData);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation {...navigation} />

      <main className="flex-grow">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-blue-200 to-blue-500 opacity-20 blur-3xl"></div>
                <div className="relative rounded-[32px] bg-white shadow-2xl ring-1 ring-gray-200 p-6">
                  <Image
                    src="/framtidssakra-cover.svg"
                    width={620}
                    height={840}
                    alt="Framtidssäkra din marknadsföring – Trender 2026"
                    className="w-full h-auto rounded-[24px]"
                    priority
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-[0.35em] uppercase text-blue-600 mb-4">
                  Rapport & checklist
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Framtidssäkra din marknadsföring – Trender 2026
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Beställ vår trendrapport och få en komprimerad lägesbild av vilka beteenden, kanaler och tekniker som påverkar marknadsföring under 2026.
                  Du får strategiska rekommendationer och checklistor som hjälper dig prioritera nästa initiativ.
                </p>
                <ul className="mt-6 space-y-3 text-gray-800">
                  <li>• 5 nyckelområden du måste optimera under 2026</li>
                  <li>• Exempel på tech-stack som ger snabb ROI</li>
                  <li>• Checklista för att ta nästa steg på 30 dagar</li>
                </ul>
                <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Beställ rapporten</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Fyll i dina uppgifter så skickar vi rapporten som PDF tillsammans med en kort analys av din
                    nuvarande närvaro.
                  </p>
                  <ReportForm />
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

