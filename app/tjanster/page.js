import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { getHomepageData, getPageBySlug } from '../../lib/api';
import { buildNavigationData, siteConfig } from '../../lib/siteConfig';
import { normalizeWordPressUrl, normalizeHtmlUrls } from '../../lib/urlUtils';

const buildMetadataFromPage = (page) => {
  const title = page?.title?.rendered?.replace(/<[^>]*>/g, '');
  const description =
    page?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || title || 'Tjänster';

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: title || 'Tjänster',
    description,
    alternates: {
      canonical: '/tjanster/',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

export async function generateMetadata() {
  const servicesPage = await getServicesPage();
  return buildMetadataFromPage(servicesPage);
}

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

const extractHeadings = (html) => {
  if (!html) return [];
  const regex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) && headings.length < 6) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (text) headings.push(text);
  }
  return headings;
};

const stripHtml = (html) =>
  html
    ? html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

const extractServiceSections = (html) => {
  if (!html) {
    return { services: [], remainingHtml: '' };
  }

  const regex =
    /<p[^>]*>\s*(?:<strong>|<b>)(.*?)<\/(?:strong|b)>\s*<\/p>([\s\S]*?)(?=<p[^>]*>\s*(?:<strong>|<b>)|$)/gi;
  const services = [];
  let match;

  // Get WordPress domain from environment
  const wordPressDomain = process.env.WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '').trim();
  const siteDomain = process.env.SITE_BASE_URL;

  while ((match = regex.exec(html))) {
    const title = stripHtml(match[1]);
    let bodyHtml = match[2].trim();

    if (!title || !bodyHtml) {
      continue;
    }

    // Normalize all URLs in the HTML content
    bodyHtml = normalizeHtmlUrls(bodyHtml, wordPressDomain, siteDomain);

    const linkMatch = bodyHtml.match(/href="([^"]+)"/i);
    let normalizedLink = linkMatch ? linkMatch[1] : null;

    const slug = normalizedLink ? getSlugFromLink(normalizedLink) : null;
    services.push({
      title,
      bodyHtml,
      summary: stripHtml(bodyHtml).slice(0, 260),
      link: normalizedLink,
      slug,
    });
  }

  // If we successfully extracted services, return empty remainingHtml
  // to avoid displaying the same content twice
  const remainingContent = services.length > 0 ? '' : html;

  return {
    services,
    remainingHtml: remainingContent ? normalizeHtmlUrls(remainingContent, wordPressDomain, siteDomain) : remainingContent,
  };
};

const getSlugFromLink = (link) => {
  if (!link) return null;
  try {
    const url = new URL(link);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
};

const getServicesPage = async () => {
  const candidateSlugs = ['tjanster', 'digitala-tjanster', 'digitala-tjanster-2'];
  for (const slug of candidateSlugs) {
    const page = await getPageBySlug(slug);
    if (page) {
      return page;
    }
  }
  return null;
};

export default async function ServicesPage() {
  const [homepageData, servicesPage] = await Promise.all([
    getHomepageData(),
    getServicesPage(),
  ]);

  // Use fallback data if WordPress page is not available
  const pageTitle = servicesPage?.title?.rendered || 'Våra Tjänster';
  const pageContent = servicesPage?.content?.rendered || '<p>Innehåll laddas...</p>';

  const navigation = buildNavigationData(homepageData);
  const heroImage = getFeaturedImage(servicesPage);
  const authorName = getAuthorName(servicesPage);
  const headings = extractHeadings(pageContent);
  const { services, remainingHtml } = extractServiceSections(pageContent);
  const finalHtml = remainingHtml || pageContent || '';

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
            {servicesPage?.excerpt?.rendered && (
              <div
                className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: servicesPage?.excerpt?.rendered || '' }}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt/"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
              >
                Boka ett möte
              </Link>

            </div>
          </div>
        </section>



        {services.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <p className="text-xs font-semibold tracking-[0.35em] text-blue-600 mb-4 uppercase">
                  Våra Tjänster
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Tjänster vi Erbjuder
                </h2>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                  Vi erbjuder ett brett utbud av digitala marknadsföringstjänster för att hjälpa ditt företag växa.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <article
                    key={service.title}
                    className="group h-full bg-white border border-gray-200 rounded-2xl p-8 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <span className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-sm">
                        {service.title.slice(0, 2).toUpperCase()}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">{service.title}</h3>
                    </div>
                    <div
                      className="text-gray-700 text-base leading-relaxed mb-6 flex-1 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>ul]:mb-4 [&>ul]:ml-4 [&>li]:mb-2"
                      dangerouslySetInnerHTML={{ __html: service.bodyHtml }}
                    />
                    <div className="pt-6 border-t border-gray-200">
                      {service.slug ? (
                        <Link
                          href={`/digitala-tjanster/${service.slug}/`}
                          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 w-full text-center group-hover:shadow-md"
                        >
                          Läs mer
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : service.link ? (
                        <Link
                          href="/kontakt/"
                          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 w-full text-center group-hover:shadow-md"
                        >
                          Kontakta oss
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <Link
                          href="/kontakt/"
                          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 w-full text-center group-hover:shadow-md"
                        >
                          Prata med oss
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {finalHtml && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <article
                className="rich-text-content max-w-none"
                dangerouslySetInnerHTML={{ __html: finalHtml }}
              />
            </div>
          </section>
        )}
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}

