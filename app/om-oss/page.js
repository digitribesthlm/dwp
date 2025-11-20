import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { getHomepageData, getPageBySlug } from '../../lib/api';
import { buildNavigationData, siteConfig } from '../../lib/siteConfig';

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

const getWordCount = (html) => {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
};

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

export async function generateMetadata() {
  const aboutPage = await getPageBySlug('om-oss');

  if (!aboutPage) {
    return {
      metadataBase: new URL(siteConfig.baseUrl),
      title: `Om oss | ${siteConfig.name}`,
      description: siteConfig.description || 'Information saknas.',
      alternates: { canonical: '/om-oss/' },
    };
  }

  const plainTitle = stripHtml(aboutPage?.title?.rendered) || 'Om oss';
  const plainExcerpt =
    stripHtml(aboutPage?.excerpt?.rendered) ||
    siteConfig.description ||
    'Lär känna oss bättre.';
  const image =
    aboutPage?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    siteConfig.defaultOgImage;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `${plainTitle} | ${siteConfig.name}`,
    description: plainExcerpt,
    alternates: { canonical: '/om-oss/' },
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      url: `${siteConfig.baseUrl}/om-oss/`,
      siteName: siteConfig.name,
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
      description: plainExcerpt,
      images: image ? [image] : undefined,
    },
  };
}

export default async function AboutPage() {
  const [homepageData, aboutPage] = await Promise.all([
    getHomepageData(),
    getPageBySlug('om-oss'),
  ]);

  // Use fallback data if WordPress page is not available
  const pageTitle = aboutPage?.title?.rendered || 'Om Oss';
  const pageContent = aboutPage?.content?.rendered || '<p>Innehåll laddas...</p>';

  const navigation = buildNavigationData(homepageData);
  const heroImage = getFeaturedImage(aboutPage);
  const authorName = getAuthorName(aboutPage);
  const wordCount = getWordCount(aboutPage?.content?.rendered);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
          {heroImage && (
            <>
              <div className="absolute inset-0">
                <img
                  src={heroImage}
                  alt={pageTitle}
                  className="w-full h-full object-cover opacity-40"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
            </>
          )}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: pageTitle }}
            />
            {aboutPage.excerpt?.rendered && (
              <div
                className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: aboutPage?.excerpt?.rendered || '' }}
              />
            )}

            <div className="flex justify-center">
              <Link
                href="/kontakt/"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
              >
                Kontakta oss
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
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}

