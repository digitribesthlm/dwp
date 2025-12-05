import { getPageBySlug } from '@/lib/api';
import { siteConfig } from '@/lib/siteConfig';

const buildMetadataFromPage = (page) => {
  const title = page?.title?.rendered?.replace(/<[^>]*>/g, '');
  const description =
    page?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || title || 'Tjänster';

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: title || 'Tjänster',
    description,
    alternates: {
      canonical: '/digitala-tjanster/',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

const getServicesPage = async () => {
  const candidateSlugs = ['tjanster', 'digitala-tjanster', 'digitala-tjanster-2'];
  for (const slug of candidateSlugs) {
    const page = await getPageBySlug(slug);
    if (page) {
      return page;
    }
  }
  return null;
};

export async function generateMetadata() {
  const servicesPage = await getServicesPage();
  return buildMetadataFromPage(servicesPage);
}

export { default } from '../tjanster/page';



