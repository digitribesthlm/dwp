import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { getHomepageData, getPageBySlug } from '../../lib/api';
import { buildNavigationData, siteConfig } from '../../lib/siteConfig';

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
  let remainingHtml = html;
  let match;

  while ((match = regex.exec(html))) {
    const title = stripHtml(match[1]);
    const bodyHtml = match[2].trim();

    if (!title || !bodyHtml) {
      continue;
    }

    const linkMatch = bodyHtml.match(/href="([^"]+)"/i);
    const slug = linkMatch ? getSlugFromLink(linkMatch[1]) : null;
    services.push({
      title,
      bodyHtml,
      summary: stripHtml(bodyHtml).slice(0, 260),
      link: linkMatch ? linkMatch[1] : null,
      slug,
    });

    remainingHtml = remainingHtml.replace(match[0], '');
  }

  return {
    services,
    remainingHtml: remainingHtml.trim(),
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

  if (!servicesPage) {
    notFound();
  }

  const navigation = buildNavigationData(homepageData);
  const heroImage = getFeaturedImage(servicesPage);
  const authorName = getAuthorName(servicesPage);
  const headings = extractHeadings(servicesPage.content?.rendered);
  const { services, remainingHtml } = extractServiceSections(
    servicesPage.content?.rendered,
  );
  const finalHtml = remainingHtml || servicesPage.content?.rendered || '';

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
                  alt={servicesPage.title.rendered}
                  className="w-full h-full object-cover opacity-40"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
            </>
          )}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: servicesPage.title.rendered }}
            />
            {servicesPage.excerpt?.rendered && (
              <div
                className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: servicesPage.excerpt.rendered }}
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
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <p className="text-xs font-semibold tracking-[0.35em] text-blue-600 mb-4 uppercase">
                  Våra Tjänster
                </p>
                <h2 className="text-4xl font-bold text-gray-900">
                  Tjänster vi Erbjuder
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                  Vi erbjuder ett brett utbud av digitala marknadsföringstjänster för att hjälpa ditt företag växa.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {services.map((service) => (
                  <article
                    key={service.title}
                    className="h-full bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 font-semibold">
                        {service.title.slice(0, 2).toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <div
                      className="text-gray-700 text-sm leading-relaxed mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: service.bodyHtml }}
                    />
                    {service.slug ? (
                      <Link
                        href={`/digitala-tjanster/${service.slug}/`}
                        className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2"
                      >
                        Läs mer →
                      </Link>
                    ) : service.link ? (
                      <Link
                        href="/kontakt/"
                        className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2"
                      >
                        Kontakta oss →
                      </Link>
                    ) : (
                      <Link
                        href="/kontakt/"
                        className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2"
                      >
                        Prata med oss →
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {finalHtml && (
          <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <article
                className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 hover:prose-a:underline
                prose-ul:text-gray-700 prose-li:mb-2"
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

