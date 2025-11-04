import React from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "Mil’Aura";
const DEFAULT_IMG = "https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/og-default.jpg"; // Using a placeholder as I cannot create files in public/

export default function Seo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMG,
  ogType = "website",
  ogLocale = "fr_FR",
  noindex = false,
  jsonLd = null
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}