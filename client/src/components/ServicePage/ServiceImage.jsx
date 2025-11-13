export default function ServiceImage() {
  return (
    <div className="relative text-center mb-[-2px] overflow-hidden">
      {/* Text Content Overlay */}
      <div className="absolute text-white left-1/2 -translate-x-1/2 bottom-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto w-[90%] md:w-[60%] z-10">
        <div className="backdrop-blur-sm bg-black/50 rounded-lg p-4 md:p-6 text-center">
          <div className="mb-4 md:mb-4 flex justify-center">
            <div className="text-4xl font-bold">Service</div>
          </div>
          <div className="mb-4 md:mb-4 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed font-light drop-shadow-lg">
            Our service department is tidy, fast, and staffed with competent
            mechanics who are eager to see you back on your bike. Our
            turn-around time is unmatched anywhere else in town. We fix
            everything bicycle related. Feel free to contact us about any
            service inquiries.
          </div>
          <div className="text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed font-light drop-shadow-lg">
            While we are a mountain bike-focused shop, we stock parts and
            service all types of bikes! The only exception is some e-bikes, as
            we may not have all the necessary parts. If you have any questions
            about this, please feel free to call or email us before coming in.
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <img
          src="IMG_1090-min.jpg"
          alt="NSBS"
          className="w-full h-[100vh] md:h-[60vw] object-cover object-[50%_center] md:object-center"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none z-0" />
      </div>
    </div>
  );
}
