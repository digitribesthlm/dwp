/**
 * Process homepage data and replace placeholder variables with actual env values
 */
export function processHomepageData(data) {
  if (!data) return data;
  
  const replacements = {
    '${SITE_BASE_URL}': process.env.SITE_BASE_URL || '',
    '${SITE_NAME}': process.env.SITE_NAME || 'Website',
    '${COMPANY_EMAIL}': process.env.COMPANY_EMAIL || '',
  };
  
  // Recursively replace placeholders in the data
  function replacePlaceholders(obj) {
    if (typeof obj === 'string') {
      let result = obj;
      for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      }
      // Also handle image paths - prepend SITE_BASE_URL if path starts with /wp-content
      if (result.startsWith('/wp-content/')) {
        result = `${replacements['${SITE_BASE_URL}']}${result}`;
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
