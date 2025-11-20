import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

export default function Footer({ data }) {
  if (!data) return null;

  const company = data?.company;
  const navigation = data?.navigation;
  const copyright = data?.copyright;

  const email = company?.contact?.email || siteConfig.contactEmail;
  const tagline = company?.tagline || siteConfig.description || '';
  const address = company?.address || siteConfig.contactAddress;
  const navItems = navigation?.primary?.length
    ? navigation.primary
    : siteConfig.navItems;

  return (
    <footer className="bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {company?.name || siteConfig.name}
            </h3>
            {tagline && <p className="text-gray-600 mb-4">{tagline}</p>}
            <div className="text-gray-600 text-sm space-y-1">
              {address && typeof address === 'object' ? (
                <>
                  <p>
                    {[address.area, address.street].filter(Boolean).join(' • ')}
                  </p>
                  <p>
                    {[address.city, address.country].filter(Boolean).join(', ')}
                  </p>
                </>
              ) : (
                address && <p>{address}</p>
              )}
              {email && (
                <p className="mt-3">
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigering</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href || item.url} className="text-gray-600 hover:text-blue-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            {email ? (
              <p className="text-gray-600 text-sm">
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                  {email}
                </a>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Uppdatera kontaktuppgifterna i ditt API eller miljövariabler
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600 text-sm">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
