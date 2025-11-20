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

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

export async function generateMetadata() {
  const contactPage = await getPageBySlug('kontakt');

  if (!contactPage) {
    return {
      metadataBase: new URL(siteConfig.baseUrl),
      title: `Kontakt | ${siteConfig.name}`,
      description: siteConfig.description || 'Kontakta oss.',
      alternates: { canonical: '/kontakt/' },
    };
  }

  const plainTitle = stripHtml(contactPage.title?.rendered) || 'Kontakt';
  const plainExcerpt =
    stripHtml(contactPage.excerpt?.rendered) ||
    siteConfig.description ||
    'Hör av dig via formuläret.';
  const image =
    contactPage._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    siteConfig.defaultOgImage;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `${plainTitle} | ${siteConfig.name}`,
    description: plainExcerpt,
    alternates: { canonical: '/kontakt/' },
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      url: `${siteConfig.baseUrl}/kontakt/`,
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

export default async function ContactPage() {
  const [homepageData, contactPage] = await Promise.all([
    getHomepageData(),
    getPageBySlug('kontakt'),
  ]);

  if (!contactPage) {
    notFound();
  }

  const navigation = buildNavigationData(homepageData);
  const heroImage = getFeaturedImage(contactPage);
  const authorName = getAuthorName(contactPage);
  const company = homepageData?.footer?.company;
  const contactEmail =
    company?.contact?.email || siteConfig.contactEmail || 'info@example.com';
  const address = company?.address || siteConfig.contactAddress;

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
                  alt={contactPage.title.rendered}
                  className="w-full h-full object-cover opacity-40"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
            </>
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: contactPage.title.rendered }}
            />
            {contactPage.excerpt?.rendered && (
              <div
                className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contactPage.excerpt.rendered }}
              />
            )}

            <div className="flex justify-center">
              <Link
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
              >
                Skicka ett mejl
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600 mb-3">
                Kontakt
              </p>
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="text-lg font-semibold text-gray-900">
                  {company?.name || siteConfig.name}
                </p>
                {typeof address === 'string' ? (
                  <p>{address}</p>
                ) : (
                  <>
                    <p>{address?.street}</p>
                    <p>
                      {[address?.city, address?.country].filter(Boolean).join(', ')}
                    </p>
                  </>
                )}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 font-semibold block mt-3"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
            </div>
            
            {/* Google Maps */}
            <div className="w-full">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{height: '400px'}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.2864858916!2d18.031806!3d59.331261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d5e8e8e8e8f%3A0x8e8e8e8e8e8e8e8e!2sJaktvarvsplan%203%2C%20112%2034%20Stockholm!5e0!3m2!1sen!2sse!4v1234567890"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Digi Growth STHLM Location"
              />
            </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 hover:prose-a:underline
              prose-ul:text-gray-700 prose-li:mb-2">
              <div dangerouslySetInnerHTML={{ __html: contactPage.content.rendered }} />
            </article>
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}

