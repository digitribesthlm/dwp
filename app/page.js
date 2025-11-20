import { getHomepageData, getBlogPosts } from '../lib/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { buildNavigationData, siteConfig } from '../lib/siteConfig';

export async function generateMetadata() {
  const data = await getHomepageData();

  const siteName = data?.footer?.company?.name || siteConfig.name;
  const heroHeading = data?.hero?.heading;
  const heroSubheading = data?.hero?.subheading;
  const description = heroSubheading || heroHeading || siteName;
  const heroImage = data?.hero?.background_image;

  const metadata = {
    metadataBase: new URL(siteConfig.baseUrl),
    title: heroHeading ? `${heroHeading} | ${siteName}` : siteName,
    description,
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: heroHeading || siteName,
      description,
      url: siteConfig.baseUrl,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: heroHeading || siteName,
      description,
    },
  };

  if (heroImage?.url) {
    metadata.openGraph.images = [
      {
        url: heroImage.url,
        width: heroImage.width || 1200,
        height: heroImage.height || 630,
        alt: heroImage.alt || heroHeading || siteName,
      },
    ];
    metadata.twitter.images = [heroImage.url];
  }

  if (!metadata.openGraph.images && siteConfig.defaultOgImage) {
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

export default async function Home() {
  const data = await getHomepageData();
  const blogPosts = await getBlogPosts(3);
  const navigation = buildNavigationData(data);
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation {...navigation} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-800 text-white py-32 md:py-40 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={data.hero.background_image.url} 
              alt={data.hero.background_image.alt}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                {data.hero.heading}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md">
                {data.hero.subheading}
              </p>
              <Link 
                href={data.hero.button.link}
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded font-bold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                {data.hero.button.text}
              </Link>
            </div>
          </div>
        </section>

        {/* MRR Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
              {data.mrr_section.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center mb-16 leading-relaxed">
              {data.mrr_section.intro_text}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {data.mrr_section.cards.map((card) => (
                <div 
                  key={card.id} 
                  className="bg-gray-50 p-8 rounded-lg hover:shadow-xl transition border border-gray-100"
                >
                  {card.image && (
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-auto mb-6 object-contain mx-auto"
                      style={{ maxWidth: '353px', height: 'auto' }}
                    />
                  )}
                  <p className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    {card.tags}
                  </p>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
              {data.case_studies_section.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center mb-16 leading-relaxed">
              {data.case_studies_section.intro_text}
            </p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.case_studies_section.studies.map((study) => (
                <div 
                  key={study.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden"
                >
                  {study.image && (
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide">
                      {study.category}
                    </p>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">
                      {study.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {study.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-gray-900">
              Från bloggen
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition border border-gray-200">
                  {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <img 
                      src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''}
                      alt={post?.title?.rendered || 'Blog post'}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(post.date).toLocaleDateString('sv-SE', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      <Link 
                        href={`/${post.slug}`}
                        className="hover:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }}
                      />
                    </h3>
                    <div 
                      className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered || '' }}
                    />
                    <Link 
                      href={`/${post.slug}`}
                      className="text-blue-600 font-semibold hover:underline inline-flex items-center"
                    >
                      Läs mer →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer data={data.footer} />
    </div>
  );
}
