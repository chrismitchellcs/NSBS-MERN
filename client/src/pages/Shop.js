import ShopContentNew from "components/Shop/ShopContentNew";
import SEO from "components/General/SEO";
import { useParams } from "react-router-dom";
import { brandPageMeta, pageMeta } from "seo/seoData.mjs";

const Shop = () => {
  const { brand } = useParams();
  const seoProps = (brand && brandPageMeta(brand)) || pageMeta("/shop");

  return (
    <div>
      <SEO {...seoProps} />
      <ShopContentNew></ShopContentNew>
    </div>
  );
};

export default Shop;
