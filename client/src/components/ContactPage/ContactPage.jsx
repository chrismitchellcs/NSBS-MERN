import ContactContent from "./ContactContent";
import MapBox from "./Map";
import FormDescription from "./FormDescription";
import ContactForm from "./ContactForm";
import HoursTable from "./HoursTable";

const ContactPage = () => {
  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/2-Norco-BC-min.png"
            alt="Trees background"
            className="h-full w-full object-cover object-center scale-105"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <ContactContent />
            <HoursTable />
            <div className="lg:col-span-2">
              <MapBox />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl" data-background>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] items-start">
            <FormDescription />
            <div className="rounded-3xl border border-gray-500 bg-gray-200 p-6 sm:p-8 shadow-xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
