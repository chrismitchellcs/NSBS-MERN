import BrandStoryBand from "components/HomePage/BrandStoryBand";

const IbisHome = () => (
  <BrandStoryBand
    imageSrc="ibisriding.jpeg"
    imageAlt="Rider on an Ibis mountain bike"
    imageObjectPosition={{ xs: "75% center", md: "center" }}
    logoSrc="ibislogo.png"
    logoAlt="Ibis Cycles"
    align="left"
    eyebrow="IBIS CYCLES"
    description="Ibis Cycles is known for their high-performance bikes, combining innovative technology, lightweight durability, and exceptional design to deliver an unparalleled riding experience."
    shopBrand="Ibis"
    logoSx={{
      width: { xs: "min(200px, 55%)", md: "min(220px, 50%)" },
      maxWidth: 240,
    }}
  />
);

export default IbisHome;
