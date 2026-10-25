import { Helmet } from "react-helmet-async";
import { DEFAULT_SHARE_IMAGE, PAGE_META, SITE_NAME, SITE_URL } from "seo/seoData.mjs";

const SEO = ({
  title = PAGE_META["/"].title,
  description = PAGE_META["/"].description,
  image = DEFAULT_SHARE_IMAGE,
  url = SITE_URL,
  type = "website",
  noindex = false,
  jsonLd = null,
}) => {
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {noindex ? null : <link rel="canonical" href={url} />}
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
};

export default SEO;
