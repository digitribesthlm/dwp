import { getBlogPostBySlug, getBlogPosts, getHomepageData } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { buildNavigationData, siteConfig } from '@/lib/siteConfig';

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const siteName = siteConfig.name;

  if (!post) {
    return {
      title: `${siteName}`,
      description: siteConfig.description || 'Inlägg saknas.',
      alternates: { canonical: `/${slug}/` },
    };
  }

  const plainTitle = stripHtml(post.title?.rendered) || siteName;
  const plainExcerpt = stripHtml(post.excerpt?.rendered) || siteConfig.description;
  const image =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || siteConfig.defaultOgImage;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: `${plainTitle} | ${siteName}`,
    description: plainExcerpt,
    alternates: {
      canonical: `/${slug}/`,
    },
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      url: `${siteConfig.baseUrl}/${slug}/`,
      type: 'article',
      siteName,
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

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  const homepageData = await getHomepageData();
  const navigation = buildNavigationData(homepageData);
  const relatedPosts = await getBlogPosts(3);
  
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || 'Sandra Ericsson';
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'SEO';
  
  // Use frontend URL for sharing instead of WordPress URL
  const publicUrl = `${siteConfig.baseUrl}/${slug}/`;
  
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  return (
    <>
      <Navigation {...navigation} />
      
      <main className="bg-white">
        {/* Article Header */}
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium">
                Article: {category}
              </span>
            </div>
            
            {/* Title */}
            <h1 
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span>By <strong>{author}</strong></span>
              <span>•</span>
              <span>
                {new Date(post.date).toLocaleDateString('sv-SE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span>•</span>
              <span>{readingTime} mins</span>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">SHARE</span>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(post.title.rendered)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Share on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={`mailto:?subject=${encodeURIComponent(post.title.rendered)}&body=${encodeURIComponent(publicUrl)}`}
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Share via Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
            
            {/* Article Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Featured Image */}
                {featuredImage && (
                  <img 
                    src={featuredImage}
                    alt={post.title.rendered}
                    className="w-full h-auto mb-8 rounded-lg"
                  />
                )}
                
                {/* Post Content with green left border for first paragraph */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    [&>p:first-of-type]:border-l-4 [&>p:first-of-type]:border-green-500 
                    [&>p:first-of-type]:pl-6 [&>p:first-of-type]:py-4 [&>p:first-of-type]:bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </div>
              
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 3).map((relatedPost) => (
                      <a
                        key={relatedPost.id}
                        href={`/${relatedPost.slug}/`}
                        className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                      >
                        <span className="text-xs text-blue-600 font-semibold mb-2 block">
                          {relatedPost._embedded?.['wp:term']?.[0]?.[0]?.name || 'Digital Strategi'}
                        </span>
                        <h4 
                          className="font-bold text-gray-900 text-sm leading-snug"
                          dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>
      
      <Footer data={homepageData.footer} />
    </>
  );
}
