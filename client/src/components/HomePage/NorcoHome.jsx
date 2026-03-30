import BrandStoryBand from "components/HomePage/BrandStoryBand";

const NorcoHome = () => (
  <BrandStoryBand
    imageSrc="gracey2-min.jpg"
    imageAlt="Rider on a Norco mountain bike"
    imageObjectPosition={{ xs: "70% center", md: "center" }}
    logoSrc="norco.svg"
    logoAlt="Norco Bicycles"
    align="left"
    eyebrow="NORCO BICYCLES"
    description="Norco is a local brand from Coquitlam, BC, offering bikes for every rider. Whether you're a beginner exploring trails and city streets or an expert seeking the fastest, most advanced bike available, Norco has you covered."
    shopBrand="Norco"
  />
);

export default NorcoHome;
