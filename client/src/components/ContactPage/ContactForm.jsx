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
          <label htmlFor="name" className="text-sm font-semibold text-gray-900">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-900"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
            placeholder="Email Address"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="text-sm font-semibold text-gray-900"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
          placeholder="Subject"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-semibold text-gray-900"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all resize-none focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
          placeholder="Message"
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
          className="inline-flex items-center justify-center rounded-lg bg-black px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </div>

      {formSent && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckIcon fontSize="small" className="text-green-600" />
          <span>Email sent! We&apos;ll reply as soon as we can.</span>
        </div>
      )}

      {formNotSent && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <ErrorOutlineIcon fontSize="small" className="text-red-600" />
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
