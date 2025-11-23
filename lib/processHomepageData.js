/**
 * Process homepage data and replace placeholder variables with actual env values
 */
export function processHomepageData(data) {
  if (!data) return data;

  // Extract WordPress base domain from API URL (must be set in env)
  const wordpressDomain = process.env.WORDPRESS_API_URL
    ?.replace('/wp-json/wp/v2', '')
    .trim();

  const replacements = {
    '${SITE_BASE_URL}': process.env.SITE_BASE_URL || '',
    '${SITE_NAME}': process.env.SITE_NAME || '',
    '${COMPANY_EMAIL}': process.env.COMPANY_EMAIL || '',
    '${WORDPRESS_MEDIA_URL}': wordpressDomain || '',
  };

  // Recursively replace placeholders in the data
  function replacePlaceholders(obj) {
    if (typeof obj === 'string') {
      let result = obj;

      // Replace all placeholders
      for (const [placeholder, value] of Object.entries(replacements)) {
        const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'g'), value);
      }

      // Auto-prepend WordPress domain for media paths
      if (wordpressDomain && result.startsWith('/wp-content/')) {
        result = `${wordpressDomain}${result}`;
      }

      return result;
    }

    if (Array.isArray(obj)) {
      return obj.map(replacePlaceholders);
    }

    if (obj && typeof obj === 'object') {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = replacePlaceholders(value);
      }
      return newObj;
    }

    return obj;
  }

  return replacePlaceholders(data);
}
