const TransitionHome = () => {
  return (
    <div className="relative text-center mb-[-2px] overflow-hidden">
      {/* Text Content Overlay */}
      <div className="absolute text-white left-1/2 -translate-x-1/2 bottom-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto w-[90%] md:w-[40%] md:ml-[50%] md:left-0 md:translate-x-0 z-10">
        <div className="backdrop-blur-sm bg-black/40 rounded-lg p-4 md:p-6 text-center">
          <div className="mb-4 md:mb-6 flex justify-center">
            <img
              src="transitionlogowhite.png"
              alt="Transition Logo"
              className="w-3/4 md:w-4/5 max-w-[600px]"
            />
          </div>
          <div className="text-sm md:text-base lg:text-lg xl:text-xl font-light drop-shadow-lg">
            We are proud to be one of the largest Transition Bikes dealers in
            Canada! Transition is a local company from Bellingham, WA. We are
            always well stocked in everything Transition offers, from XC to DH.
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <img
          src="hannahb-min.jpg"
          alt="NSBS"
          className="w-full h-[80vh] md:h-[45.1vw] object-cover object-[25%_center] md:object-center"
          loading="lazy"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none z-0" />
      </div>
    </div>
  );
};

export default TransitionHome;
