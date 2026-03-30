import ShopContentNew from "components/Shop/ShopContentNew";
import SEO from "components/General/SEO";
import { useParams } from "react-router-dom";

const Shop = () => {
  const { brand } = useParams();
  const isTransition = brand?.toLowerCase() === "transition";

  const seoProps = isTransition
    ? {
        title: "Transition Bikes Canada | Shop Transition at North Shore Bike Shop",
        description:
          "Shop Transition Bikes in Canada. North Shore Bike Shop is one of the largest Transition dealers in Canada. Sentinel, Spur, Smuggler, Patrol & more. North Vancouver, BC.",
        keywords:
          "Transition Canada, Transition bikes Canada, Transition bikes, Transition Sentinel, Transition Spur, Transition Smuggler, Transition Patrol, mountain bikes Canada, North Vancouver bike shop",
        url: "https://www.northshorebikeshop.net/shop/transition",
      }
    : {
        title: "Shop Mountain Bikes | Transition, Norco & Ibis | North Shore Bike Shop",
        description:
          "Browse our selection of premium mountain bikes from Transition, Norco, and Ibis. Find your new mountain bike in North Vancouver, BC.",
        keywords:
          "Transition Canada, Transition bikes Canada, mountain bikes for sale, Transition bikes, Norco bikes, Ibis bikes, bike shop, trail bikes, enduro bikes, mountain bike store BC",
        url: brand
          ? `https://www.northshorebikeshop.net/shop/${brand}`
          : "https://www.northshorebikeshop.net/shop",
      };

  return (
    <div>
      <SEO {...seoProps} />
      <ShopContentNew></ShopContentNew>
    </div>
  );
};

export default Shop;
