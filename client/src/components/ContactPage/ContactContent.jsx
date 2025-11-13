const ContactContent = () => {
  return (
    <div className="flex h-full w-full">
      <div className="w-full rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 text-left shadow-xl backdrop-blur-md">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-300">
              Visit Us
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              North Shore Bike Shop
            </h2>
          </div>
          <p className="text-base text-slate-100 sm:text-lg">
            1831 Lonsdale Avenue
            <br />
            North Vancouver, BC
            <br />
            V7M 2J8
          </p>
          <div className="space-y-2 text-sm text-slate-200 sm:text-base">
            <p>
              <span className="font-medium text-white">Phone:</span>{" "}
              <a
                href="tel:16049296727"
                className="text-slate-100 transition hover:text-white"
              >
                (604) 929-6727
              </a>
            </p>
            <p>
              <span className="font-medium text-white">Email:</span>{" "}
              <a
                href="mailto:northshorebikeshop@gmail.com"
                className="text-slate-100 transition hover:text-white"
              >
                northshorebikeshop@gmail.com
              </a>
            </p>
          </div>
          <div>
            <a
              href="https://maps.google.com/?q=North+Shore+Bike+Shop"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/40 bg-slate-300/10 px-4 py-2 text-sm font-medium text-slate-100 shadow hover:border-slate-100/60 hover:bg-slate-300/20"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContent;
