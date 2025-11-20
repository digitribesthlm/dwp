import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { getHomepageData, getCategoryBySlug, getPostsByCategory, getAllCategorySlugs } from '../../../lib/api';
import { buildNavigationData, siteConfig } from '../../../lib/siteConfig';

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating category params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      metadataBase: new URL(siteConfig.baseUrl),
      title: `Kategori | ${siteConfig.name}`,
      description: siteConfig.description || 'Kategori saknas.',
      alternates: { canonical: `/category/${slug}/` },
    };
  }

  const plainName = stripHtml(category.name) || 'Kategori';
  const plainDescription =
    stripHtml(category.description) ||
    `Alla artiklar inom ${plainName}` ||
    siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `${plainName} | ${siteConfig.name}`,
    description: plainDescription,
    alternates: {
      canonical: `/category/${slug}/`,
    },
    openGraph: {
      title: `${plainName} | ${siteConfig.name}`,
      description: plainDescription,
      url: `${siteConfig.baseUrl}/category/${slug}/`,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${plainName} | ${siteConfig.name}`,
      description: plainDescription,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [homepageData, category] = await Promise.all([
    getHomepageData(),
    getCategoryBySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  const navigation = buildNavigationData(homepageData);
  const posts = await getPostsByCategory(category.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation {...navigation} />

      <main className="flex-grow">
        {/* Category Header */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-wider mb-4 opacity-90">
              KATEGORI: {category.name.toUpperCase()}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              {category.name}
            </h1>
            {category.description && (
              <div
                className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}
            <p className="mt-6 text-blue-200">
              {posts.length} {posts.length === 1 ? 'artikel' : 'artiklar'}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Inga artiklar hittades i denna kategori.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const featuredImage =
                    post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const author =
                    post._embedded?.author?.[0]?.name || 'Sandra Ericsson';
                  const excerpt = stripHtml(post.excerpt?.rendered) || '';

                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}/`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      {/* Featured Image */}
                      {featuredImage && (
                        <div className="aspect-video overflow-hidden bg-gray-200">
                          <img
                            src={featuredImage}
                            alt={stripHtml(post.title.rendered)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold uppercase">
                            {category.name}
                          </span>
                        </div>

                        {/* Title */}
                        <h2
                          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />

                        {/* Excerpt */}
                        {excerpt && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{author}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(post.date).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer data={homepageData?.footer} />
    </div>
  );
}
