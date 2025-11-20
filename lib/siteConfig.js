const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const defaultNavItems = [
  { label: 'Hem', href: '/' },
  { label: 'Tjänster', href: '/tjanster/' },
  { label: 'Blogg', href: '/blogg/' },
  { label: 'Om oss', href: '/om-oss/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const siteConfig = {
  name: process.env.SITE_NAME || 'Webbplats',
  description: process.env.SITE_DESCRIPTION || '',
  baseUrl: process.env.SITE_BASE_URL || 'http://localhost:3000',
  defaultOgImage: process.env.DEFAULT_OG_IMAGE_URL || '/globe.svg',
  defaultOgImageAlt: process.env.DEFAULT_OG_IMAGE_ALT || 'Förhandsvisning',
  navItems: parseJson(process.env.NAV_PRIMARY, defaultNavItems),
  navCtaLabel: process.env.NAV_CTA_LABEL || 'Kontakta oss',
  navCtaHref: process.env.NAV_CTA_HREF || '/kontakt/',
  contactEmail: process.env.COMPANY_EMAIL || '',
  contactAddress: parseJson(process.env.COMPANY_ADDRESS, null) || null,
};

const normalizeNavItems = (items) =>
  (items || []).map((item) => ({
    label: item.label,
    href: item.href || item.url || '/',
  }));

export const buildNavigationData = (homepageData) => {
  const normalized = normalizeNavItems(homepageData?.header?.navigation);
  return {
    brandName: homepageData?.footer?.company?.name || siteConfig.name,
    menuItems: normalized.length ? normalized : siteConfig.navItems,
    cta: {
      label:
        homepageData?.header?.cta?.label ||
        siteConfig.navCtaLabel ||
        siteConfig.navItems?.[0]?.label ||
        'Kontakta oss',
      href: homepageData?.header?.cta?.href || siteConfig.navCtaHref,
    },
  };
};

export const buildFooterFallback = (homepageData) => ({
  email:
    homepageData?.footer?.company?.contact?.email ||
    siteConfig.contactEmail ||
    '',
});

