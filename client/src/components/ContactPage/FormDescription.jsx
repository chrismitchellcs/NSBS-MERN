const FormDescription = () => {
  return (
    <div className="rounded-3xl border border-gray-500 bg-gray-200 p-6 text-left shadow-xl backdrop-blur-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-black sm:text-4xl">
        Contact Us
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
        If you have any questions, inquiries, or just want to chat about bikes,
        don&apos;t hesitate to reach out. We try to reply to emails within the
        business day. Fill out the form and we&apos;ll respond via email, or use
        <span className="font-semibold text-gray-800">
          {" "}
          northshorebikeshop@gmail.com
        </span>{" "}
        to contact us directly.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-800 sm:text-base">
        Prefer to talk it through? Call or text us at
        <span className="font-semibold text-gray-800"> (604) 929-6727</span>.
        We&apos;re here to help you keep your ride dialled.
      </p>
    </div>
  );
};

export default FormDescription;
