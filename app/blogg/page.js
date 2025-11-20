import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { getHomepageData, getBlogPosts } from '../../lib/api';
import { buildNavigationData, siteConfig } from '../../lib/siteConfig';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getCategory = (post) => post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';

const getFeaturedImage = (post) =>
  post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

const getReadingTime = (post) => {
  const html = post?.content?.rendered;
  if (!html) return null;
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  if (!words) return null;
  return Math.max(1, Math.round(words / 200));
};

const categoriesDescription = (categories, totalPosts) => {
  if (categories.length === 0) {
    return 'Inga kategorier skickades med i WordPress-svaret.';
  }
  const list = categories
    .map((category) => `${category.name} (${category.count})`)
    .join(', ');
  return `Kategoriöversikt: ${list}. Totalt ${totalPosts} artiklar i listan.`;
};

export async function generateMetadata() {
  const data = await getHomepageData();
  const siteName = data?.footer?.company?.name || siteConfig.name;
  const description =
    siteConfig.description ||
    'Aktuella artiklar, case och guider hämtade direkt från WordPress-flödet.';

  const metadata = {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `Blogg | ${siteName}`,
    description,
    alternates: {
      canonical: '/blogg/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Blogg | ${siteName}`,
      description,
      url: `${siteConfig.baseUrl}/blogg/`,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Blogg | ${siteName}`,
      description,
    },
  };

  if (siteConfig.defaultOgImage) {
    metadata.openGraph.images = [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.defaultOgImageAlt,
      },
    ];
    metadata.twitter.images = [siteConfig.defaultOgImage];
  }

  return metadata;
}

export default async function BloggPage() {
  const [homepageData, posts] = await Promise.all([
    getHomepageData(),
    getBlogPosts(12),
  ]);
  const navigation = buildNavigationData(homepageData);

  const allPosts = posts || [];
  const heroPost = allPosts[0];
  const otherPosts = allPosts.slice(1);
  const sidebarPosts = otherPosts.slice(0, 3);

  const categoryCounts = allPosts.reduce((acc, post) => {
    const category = getCategory(post);
    if (!category) return acc;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        {/* Hero */}
        {heroPost ? (
          <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
            {getFeaturedImage(heroPost) && (
              <>
                <div className="absolute inset-0">
                  <img
                    src={getFeaturedImage(heroPost)}
                    alt={heroPost.title.rendered}
                    className="w-full h-full object-cover opacity-40"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
              </>
            )}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xs font-semibold tracking-[0.3em] text-blue-300 mb-6 uppercase">
                {getCategory(heroPost)?.toUpperCase() || 'BLOGG'}
              </p>
              <h1
                className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
                dangerouslySetInnerHTML={{ __html: heroPost.title.rendered }}
              />
              <p className="text-base md:text-lg text-gray-200 mb-4">
                {formatDate(heroPost.date)}
                {getReadingTime(heroPost) && (
                  <span className="ml-2 text-gray-400">
                    · {getReadingTime(heroPost)} min lästid
                  </span>
                )}
              </p>
              <div
                className="text-lg text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: heroPost.excerpt.rendered }}
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${heroPost.slug}/`}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Läs artikeln
                </Link>
                <a
                  href={heroPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-white/10 text-white px-8 py-3 rounded-md text-lg font-semibold backdrop-blur hover:bg-white/20 transition"
                >
                  Öppna på WordPress
                </a>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-24 text-center bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-4">
                BLOGG
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Inga publicerade artiklar ännu
              </h1>
              <p className="text-lg text-gray-300">
                WordPress-flödet svarade utan poster. Försök igen senare.
              </p>
            </div>
          </section>
        )}

        {/* Featured + Sidebar */}
        {heroPost && (
          <section className="py-20 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12 items-stretch">
              <article className="lg:col-span-2 bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                {getFeaturedImage(heroPost) && (
                  <img
                    src={getFeaturedImage(heroPost)}
                    alt={heroPost.title.rendered}
                    className="w-full h-80 object-cover"
                  />
                )}
                <div className="p-10">
                  <p className="text-sm font-semibold text-blue-600 uppercase mb-3">
                    {getCategory(heroPost) || 'Artikel'}
                  </p>
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight"
                    dangerouslySetInnerHTML={{ __html: heroPost.title.rendered }}
                  />
                  <p className="text-sm text-gray-500 mb-6">
                    {formatDate(heroPost.date)}
                  </p>
                  <div
                    className="text-base text-gray-700 leading-relaxed line-clamp-4 mb-8"
                    dangerouslySetInnerHTML={{ __html: heroPost.excerpt.rendered }}
                  />
                  <Link
                    href={`/${heroPost.slug}/`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Läs artikeln →
                  </Link>
                </div>
              </article>

              <div className="space-y-6">
                <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">
                    Ämnen från WordPress ({sortedCategories.length})
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Visar kategorier baserat på de senaste {allPosts.length} posterna.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sortedCategories.map((category) => (
                      <span
                        key={category.name}
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20"
                      >
                        {category.name} · {category.count}
                      </span>
                    ))}
                    {sortedCategories.length === 0 && (
                      <span className="text-sm text-gray-400">
                        Inga kategorier från API:t
                      </span>
                    )}
                  </div>
                </div>

                {sidebarPosts.length > 0 && (
                  <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Fler artiklar från flödet
                    </h3>
                    <div className="space-y-4">
                      {sidebarPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/${post.slug}/`}
                          className="block p-4 rounded-2xl border border-blue-100 bg-white hover:border-blue-200 transition"
                        >
                          <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                            {getCategory(post) || 'Artikel'}
                          </p>
                          <p
                            className="font-semibold text-gray-900 text-sm leading-snug"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(post.date)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Articles */}
        <section id="artiklar" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600 mb-3">
                  WordPress-feed
                </p>
                <h2 className="text-4xl font-bold text-gray-900">
                  {`Visar ${otherPosts.length} ytterligare artiklar`}
                </h2>
                <p className="text-gray-600 mt-3">
                  {categoriesDescription(sortedCategories, otherPosts.length)}
                </p>
              </div>
              <Link
                href="/blogg/"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                Öppna alla artiklar →
              </Link>
            </div>

            {otherPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <p className="text-lg text-gray-600">
                  WordPress returnerade bara en artikel den här gången.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col"
                  >
                    {getFeaturedImage(post) && (
                      <img
                        src={getFeaturedImage(post)}
                        alt={post.title.rendered}
                        className="w-full h-48 object-cover rounded-t-3xl"
                      />
                    )}
                    <div className="p-8 flex flex-col flex-1">
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
                        {getCategory(post) || 'Artikel'}
                      </p>
                      <h3
                        className="text-xl font-bold text-gray-900 mb-3 leading-snug"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <p className="text-sm text-gray-500 mb-4">
                        {formatDate(post.date)}
                      </p>
                      <div
                        className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-6"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      <div className="mt-auto">
                        <Link
                          href={`/${post.slug}/`}
                          className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center"
                        >
                          Läs mer →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}


