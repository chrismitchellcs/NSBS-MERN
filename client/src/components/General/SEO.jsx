import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "North Shore Bike Shop | Transition Canada | Mountain Bikes & Service",
  description = "North Shore Bike Shop is one of the largest Transition Bikes dealers in Canada. Premium Transition, Norco, and Ibis mountain bikes. Expert service in North Vancouver, BC.",
  keywords = "Transition Canada, Transition bikes Canada, mountain bikes, bike shop, bike service, Transition bikes, Norco bikes, Ibis bikes, bike repair, bike tune-up, BC bike shop, North Vancouver, BC, North Shore Bike Shop, e bikes",
  image = "/logosquare.png",
  url = "https://www.northshorebikeshop.net",
  type = "website",
}) => {
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://www.northshorebikeshop.net${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
