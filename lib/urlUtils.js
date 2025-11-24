/**
 * Normalize WordPress URLs to use the site domain instead of WordPress subdomain
 *
 * This utility handles URLs from WordPress and converts them to relative URLs
 * when they match the WordPress domain or site domain.
 *
 * @param {string} url - The URL to normalize
 * @param {string} wordPressDomain - The WordPress domain (e.g., 'https://wp.example.com')
 * @param {string} siteDomain - The site domain (e.g., 'https://www.example.com')
 * @returns {string} - Normalized URL (relative when possible)
 */
export function normalizeWordPressUrl(url, wordPressDomain, siteDomain) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  let normalizedUrl = url.trim();

  // Handle URLs that are already relative
  if (normalizedUrl.startsWith('/')) {
    return normalizedUrl;
  }

  // Extract hostname from WordPress domain for dynamic matching
  let wpHostname = null;
  if (wordPressDomain) {
    try {
      wpHostname = new URL(wordPressDomain).hostname;
    } catch {
      // Invalid WordPress domain
    }
  }

  // Add protocol if missing but domain is present (dynamic check)
  if (wpHostname && normalizedUrl.startsWith(wpHostname)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Try to parse as URL
  try {
    const urlObj = new URL(normalizedUrl);

    // Check if it's a WordPress domain URL
    if (wordPressDomain && urlObj.origin === new URL(wordPressDomain).origin) {
      // Convert to relative URL by returning just the pathname
      return urlObj.pathname;
    }

    // If it's the site domain, also make it relative
    if (siteDomain && urlObj.origin === new URL(siteDomain).origin) {
      return urlObj.pathname;
    }

    // External URL - return as is
    return normalizedUrl;
  } catch (error) {
    // If URL parsing fails, check for common patterns dynamically

    // Check if it contains the WordPress hostname
    if (wpHostname && normalizedUrl.includes(wpHostname)) {
      // Extract the path after the domain using dynamic hostname
      const escapedHostname = wpHostname.replace(/\./g, '\\.');
      const pathMatch = normalizedUrl.match(new RegExp(`${escapedHostname}(\\/[^?#]*)`));
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }
    }

    // Return as is if we can't normalize it
    return normalizedUrl;
  }
}

/**
 * Process HTML content and normalize all WordPress URLs
 *
 * @param {string} html - HTML content containing URLs
 * @param {string} wordPressDomain - The WordPress domain
 * @param {string} siteDomain - The site domain
 * @returns {string} - HTML with normalized URLs
 */
export function normalizeHtmlUrls(html, wordPressDomain, siteDomain) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  // Replace href attributes
  let result = html.replace(/href="([^"]*)"/gi, (match, url) => {
    const normalized = normalizeWordPressUrl(url, wordPressDomain, siteDomain);
    return `href="${normalized}"`;
  });

  // Replace src attributes (for completeness, though media URLs might be handled elsewhere)
  result = result.replace(/src="([^"]*)"/gi, (match, url) => {
    const normalized = normalizeWordPressUrl(url, wordPressDomain, siteDomain);
    return `src="${normalized}"`;
  });

  return result;
}
