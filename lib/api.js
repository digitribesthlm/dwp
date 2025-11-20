import { processHomepageData } from './processHomepageData';

const HOMEPAGE_API_URL = process.env.HOMEPAGE_API_URL;
const HOMEPAGE_API_TOKEN = process.env.HOMEPAGE_API_TOKEN;
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || `${process.env.SITE_BASE_URL}/wp-json/wp/v2`;

/**
 * Fetch homepage data from JSON API
 */
export async function getHomepageData() {
  try {
    const url = `${HOMEPAGE_API_URL}?token=${HOMEPAGE_API_TOKEN}&v=${Date.now()}`;
    
    const res = await fetch(url, {
      cache: 'no-store' // Disable cache to get fresh data
    });
    
    if (!res.ok) {
      console.warn(`Homepage API returned ${res.status}, falling back to local JSON`);
      // Fall back to local JSON file
      const fallbackData = await import('../public/homepage-data.json');
      return processHomepageData(fallbackData.default);
    }
    
    const data = await res.json();
    return processHomepageData(data);
  } catch (error) {
    console.error('Error fetching homepage data, using fallback:', error);
    // Fall back to local JSON file
    const fallbackData = await import('../public/homepage-data.json');
    return processHomepageData(fallbackData.default);
  }
}

/**
 * Fetch latest blog posts from WordPress REST API
 */
export async function getBlogPosts(perPage = 3) {
  try {
    const url = `${WORDPRESS_API_URL}/posts?per_page=${perPage}&_embed`;
    
    const res = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      console.warn(`Blog posts API returned ${res.status}, returning empty array`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug) {
  try {
    const normalizedSlug = decodeURIComponent(slug);
    const encodedSlug = encodeURIComponent(normalizedSlug);
    const url = `${WORDPRESS_API_URL}/posts?slug=${encodedSlug}&_embed`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.warn(`Blog post API returned ${res.status} for slug: ${slug}`);
      return null;
    }

    const posts = await res.json();

    if (posts.length > 0) {
      return posts[0];
    }

    for (let page = 1; page <= 10; page++) {
      const fallbackRes = await fetch(
        `${WORDPRESS_API_URL}/posts?per_page=100&page=${page}&_embed`,
        {
          next: { revalidate: 300 },
        },
      );

      if (!fallbackRes.ok) {
        if (fallbackRes.status === 400) {
          break;
        }
        console.warn(`Fallback posts API returned ${fallbackRes.status}`);
        break;
      }

      const fallbackPosts = await fallbackRes.json();
      const match = fallbackPosts.find((post) => post.slug === normalizedSlug);
      if (match) {
        return match;
      }

      if (fallbackPosts.length < 100) {
        break;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

/**
 * Fetch all blog post slugs for static generation
 */
export async function getAllBlogPostSlugs() {
  try {
    const url = `${WORDPRESS_API_URL}/posts?per_page=100`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      console.warn(`Blog post slugs API returned ${res.status}, returning empty array`);
      return [];
    }
    
    const posts = await res.json();
    
    return posts.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching blog post slugs:', error);
    return [];
  }
}

/**
 * Fetch a WordPress page by slug
 */
export async function getPageBySlug(slug) {
  try {
    const url = `${WORDPRESS_API_URL}/pages?slug=${slug}&_embed`;

    const res = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!res.ok) {
      console.warn(`Page API returned ${res.status} for slug: ${slug}`);
      return null;
    }

    const pages = await res.json();

    if (!pages || pages.length === 0) {
      return null;
    }

    return pages[0];
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

/**
 * Fetch all service page slugs under /digitala-tjanster/
 */
export async function getServicePageSlugs() {
  try {
    const url = `${WORDPRESS_API_URL}/pages?per_page=100&_embed`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Service slugs API returned ${res.status}, returning empty array`);
      return [];
    }

    const pages = await res.json();

    return pages
      .filter((page) => page.link?.includes('/digitala-tjanster/'))
      .map((page) => page.slug);
  } catch (error) {
    console.error('Error fetching service page slugs:', error);
    return [];
  }
}

/**
 * Fetch all categories from WordPress
 */
export async function getCategories() {
  try {
    const url = `${WORDPRESS_API_URL}/categories?per_page=100`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      console.warn(`Categories API returned ${res.status}, returning empty array`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug) {
  try {
    const url = `${WORDPRESS_API_URL}/categories?slug=${slug}`;
    
    const res = await fetch(url, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (!res.ok) {
      console.warn(`Category API returned ${res.status} for slug: ${slug}`);
      return null;
    }
    
    const categories = await res.json();
    
    if (!categories || categories.length === 0) {
      return null;
    }
    
    return categories[0];
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Fetch posts by category ID
 */
export async function getPostsByCategory(categoryId, perPage = 100) {
  try {
    const url = `${WORDPRESS_API_URL}/posts?categories=${categoryId}&per_page=${perPage}&_embed`;
    
    const res = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      console.warn(`Posts by category API returned ${res.status}, returning empty array`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

/**
 * Fetch all category slugs for static generation
 */
export async function getAllCategorySlugs() {
  try {
    const categories = await getCategories();
    return categories.map(cat => cat.slug);
  } catch (error) {
    console.error('Error fetching category slugs:', error);
    return [];
  }
}
