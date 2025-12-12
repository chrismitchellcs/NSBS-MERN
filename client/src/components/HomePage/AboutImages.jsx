import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Shop Mountain Bikes",
    description: "Premium bikes from Transition, Norco, & Ibis",
    buttonText: "Shop Bikes",
    image: "LIT01445 copy-min.jpg",

    link: "/shop",
  },
  {
    title: "Expert Bike Service",
    description: "Fast turnaround, expert mechanics",
    buttonText: "Service Info",
    image: "IMG_1090-min.jpg",
    link: "/service",
  },
  {
    title: "Visit Our Shop",
    description: "Located in North Vancouver, BC",
    buttonText: "Contact Us",
    image: "mattriding-min.jpeg",
    link: "/contact",
  },
];

const AboutImages = () => {
  const navigate = useNavigate();

  const Card = ({ card }) => {
    return (
      <button
        className="flex-1 aspect-[4/3] overflow-hidden relative rounded-lg shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl border-2 border-transparent hover:border-white/30"
        style={{
          isolation: "isolate", // Creates new stacking context for better performance
          contain: "layout style paint", // Tells browser to optimize this element
        }}
      >
        {/* Image - base layer with GPU acceleration */}
        <img
          src={card.image}
          alt={card.description}
          className="w-full h-full object-cover object-center"
          style={{
            transform: "translateZ(0)", // Force GPU layer
            willChange: "transform", // Optimize for transforms
            backfaceVisibility: "hidden", // Prevent flickering
          }}
          loading="eager"
          decoding="async"
        />

        {/* Gradient overlay - optimized */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent z-10"
          style={{
            transform: "translateZ(0)", // GPU layer
            willChange: "opacity", // Optimize for opacity changes
          }}
        />

        {/* Content overlay - optimized */}
        <div
          className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-8 z-20 pointer-events-none"
          style={{
            transform: "translateZ(0)", // GPU layer
          }}
        >
          <h3 className="text-white xs:text-xl sm:text-xl md:text-2xl font-[400] mb-2 drop-shadow-lg pointer-events-none tracking-tight">
            {card.title}
          </h3>
          <p className="text-white text-sm md:text-base mb-4 opacity-90 drop-shadow-md pointer-events-none tracking-tight">
            {card.description}
          </p>
          <div className="pointer-events-auto">
            <button
              className="text-black text-sm font-medium bg-white bg-opacity-80 px-4 py-2 rounded-md hover:bg-opacity-100 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                navigate(card.link);
              }}
            >
              {card.buttonText}
            </button>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-5 px-5 py-5 bg-white">
      {cards.map((card) => (
        <Card key={card.title} card={card} />
      ))}
    </div>
  );
};

export default AboutImages;
