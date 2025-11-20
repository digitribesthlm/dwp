'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation({
  brandName = 'Varumärke',
  menuItems = [],
  cta = { href: '/kontakt/', label: 'Kontakta oss' },
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items = menuItems.length > 0 ? menuItems : [{ label: 'Hem', href: '/' }];
  const ctaHref = cta?.href || '/kontakt/';
  const ctaLabel = cta?.label || 'Kontakta oss';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {brandName}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium text-center"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="block bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition font-medium text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
