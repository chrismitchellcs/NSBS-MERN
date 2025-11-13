import { useRef, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ContactForm = () => {
  const [formSent, setFormSent] = useState(false);
  const [formNotSent, setFormNotSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSent(false);
    setFormNotSent(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const token = captchaRef.current?.getValue();

    if (!token) {
      setFormNotSent(true);
      return;
    }

    captchaRef.current?.reset();

    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendform`,
        {
          token,
          name,
          email,
          subject,
          message,
        }
      );
      setFormSent(true);
      form.reset();
    } catch (error) {
      console.log(error);
      setFormNotSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-800">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-2xl border border-gray-500 bg-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-800 outline-none transition focus:border-gray-300 focus:bg-white/20"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-gray-500 bg-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-800 outline-none transition focus:border-gray-300 focus:bg-white/20"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-gray-800">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full rounded-2xl border border-gray-500 bg-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-800 outline-none transition focus:border-gray-300 focus:bg-white/20"
          placeholder="How can we help?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-2xl border border-gray-500 bg-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-800 outline-none transition focus:border-gray-00 focus:bg-gray-200"
          placeholder="Tell us more about your bike, service request, or question."
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ReCAPTCHA
          sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU"
          ref={captchaRef}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-gray-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-lg transition hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </div>

      {formSent && (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-400/40 bg-gray-500/10 px-4 py-3 text-sm text-gray-800">
          <CheckIcon fontSize="small" />
          <span>Email sent! We&apos;ll reply as soon as we can.</span>
        </div>
      )}

      {formNotSent && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-800">
          <ErrorOutlineIcon fontSize="small" />
          <span>
            Something went wrong. Please try again or email us directly at{" "}
            northshorebikeshop@gmail.com.
          </span>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
