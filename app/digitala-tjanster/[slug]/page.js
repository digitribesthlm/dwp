import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import {
  getHomepageData,
  getPageBySlug,
  getServicePageSlugs,
} from '../../../lib/api';
import { buildNavigationData, siteConfig } from '../../../lib/siteConfig';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getFeaturedImage = (page) =>
  page?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

const getAuthorName = (page) => page?._embedded?.author?.[0]?.name || '';

const stripHtml = (html) =>
  html
    ? html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

const getBreadcrumb = (slug) => [
  { label: 'Hem', href: '/' },
  { label: 'Tjänster', href: '/tjanster/' },
  { label: 'Digitala tjänster', href: '/tjanster/#tjanster' },
  { label: slug.replace(/-/g, ' ') },
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      metadataBase: new URL(siteConfig.baseUrl),
      title: `Tjänst saknas | ${siteConfig.name}`,
      description: 'Vi kunde tyvärr inte hitta den här tjänsten just nu.',
      alternates: { canonical: `/digitala-tjanster/${slug}/` },
    };
  }

  const plainTitle = stripHtml(page.title?.rendered) || 'Digital tjänst';
  const plainExcerpt = stripHtml(page.excerpt?.rendered);
  const siteName = siteConfig.name;
  const image =
    page._embedded?.['wp:featuredmedia']?.[0]?.source_url || siteConfig.defaultOgImage;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `${plainTitle} | ${siteName}`,
    description:
      plainExcerpt ||
      'Fördjupad tjänstebeskrivning av våra digitala tjänster.',
    alternates: { canonical: `/digitala-tjanster/${slug}/` },
    openGraph: {
      title: plainTitle,
      description:
        plainExcerpt ||
        'Fördjupad tjänstebeskrivning av våra digitala tjänster.',
      url: `${siteConfig.baseUrl}/digitala-tjanster/${slug}/`,
      siteName,
      type: 'article',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: plainTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: plainTitle,
      description:
        plainExcerpt ||
        'Fördjupad tjänstebeskrivning av våra digitala tjänster.',
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getServicePageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;

  const [homepageData, page] = await Promise.all([
    getHomepageData(),
    getPageBySlug(slug),
  ]);

  if (!page) {
    notFound();
  }

  const navigation = buildNavigationData(homepageData);
  const heroImage = getFeaturedImage(page);
  const authorName = getAuthorName(page);
  const breadcrumbs = getBreadcrumb(slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        <section className="relative bg-gray-900 text-white py-16 md:py-24 overflow-hidden">
          {heroImage && (
            <>
              <div className="absolute inset-0">
                <img
                  src={heroImage}
                  alt={page.title.rendered}
                  className="w-full h-full object-cover opacity-40"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
            </>
          )}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-xs uppercase tracking-[0.35em] text-gray-300 mb-6 flex flex-wrap gap-2">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-gray-300 hover:text-white transition"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-gray-500">/</span>
                  )}
                </span>
              ))}
            </nav>
            <p className="text-xs font-semibold tracking-[0.3em] text-blue-300 mb-4 uppercase">
              Digital tjänst
            </p>
            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: page.title.rendered }}
            />
            {page.excerpt?.rendered && (
              <div
                className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: page.excerpt.rendered }}
              />
            )}
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-10">
              <span>Publicerad {formatDate(page.date)}</span>
              {page.modified && (
                <span>Senast uppdaterad {formatDate(page.modified)}</span>
              )}
              {authorName && <span>Av {authorName}</span>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/kontakt/"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
              >
                Ta kontakt
              </Link>
              <Link
                href="/tjanster/"
                className="inline-flex items-center justify-center bg-white/10 text-white px-8 py-3 rounded-md text-lg font-semibold backdrop-blur hover:bg-white/20 transition"
              >
                Alla tjänster
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600 mb-3">
                Om tjänsten
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {stripHtml(page.excerpt?.rendered) ||
                  'Kontakta oss för mer information om denna tjänst.'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600 mb-3">
                Nästa steg
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Nyfiken på hur den här tjänsten kan appliceras på din situation? Kontakta oss
                så tar vi fram en plan.
              </p>
              <Link
                href="/kontakt/"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
              >
                Boka samtal
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <article
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 hover:prose-a:underline
                prose-ul:text-gray-700 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: page.content?.rendered }}
            />
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}

