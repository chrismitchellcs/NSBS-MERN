import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faLocationDot,
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { StatusDot, useShopStatus } from "components/General/NavShopStatus";
import { NAV_BAR_BG } from "utils/brandColors";
import { SHOP_BRANDS } from "utils/shopFilters";
import {
  SHOP_ADDRESS,
  SHOP_DIRECTIONS_URL,
  SHOP_EMAIL,
  SHOP_PHONE,
  shopHoursSummary,
} from "utils/shopHours";

const SHOP_LINKS = [
  { to: "/shop", label: "All bikes" },
  { to: "/shop?sale=1", label: "On sale" },
  ...SHOP_BRANDS.map((b) => ({ to: `/shop/${b.toLowerCase()}`, label: b })),
];

const MORE_LINKS = [
  { to: "/service", label: "Service" },
  { to: "/contact", label: "Contact" },
  { to: "/return-policy", label: "Return policy" },
];

const headingClass = "mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60";
const linkClass =
  "text-sm text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded";
const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

const LinkColumn = ({ title, links }) => (
  <nav aria-label={title}>
    <h2 className={headingClass}>{title}</h2>
    <ul className="space-y-2.5">
      {links.map(({ to, label }) => (
        <li key={to}>
          <Link to={to} className={linkClass}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const Closer = () => {
  const status = useShopStatus();

  return (
    <footer className="w-full text-white" style={{ backgroundColor: NAV_BAR_BG }}>
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-6 md:pt-14 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <img
              src="/logowhitehq.png"
              alt="North Shore Bike Shop"
              className="h-auto w-44 sm:w-52"
              loading="lazy"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              Bikes, parts and service on Lonsdale, from people who ride the Shore.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/north_shore_bike_shop/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
              </a>
              <a
                href="https://www.pinkbike.com/u/north-shore-bike-shop/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Pinkbike"
              >
                <img src="/pinkbike.png" alt="" className="h-5 w-5 brightness-0 invert" loading="lazy" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <LinkColumn title="Shop" links={SHOP_LINKS} />
          </div>
          <div className="md:col-span-2">
            <LinkColumn title="More" links={MORE_LINKS} />
          </div>

          <div className="col-span-2 md:col-span-4">
            <h2 className={headingClass}>Visit us</h2>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="mt-0.5 w-4 text-white/70" />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <StatusDot isOpen={status.isOpen} />
                    {status.label}
                  </div>
                  <div className="mt-0.5 text-white/75">{shopHoursSummary()}</div>
                </div>
              </li>
              <li>
                <a
                  href={SHOP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-3 ${linkClass}`}
                >
                  <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 w-4 text-white/70" />
                  <span>
                    {SHOP_ADDRESS.street}
                    <br />
                    {SHOP_ADDRESS.city} {SHOP_ADDRESS.postalCode}
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${SHOP_PHONE.tel}`} className={`flex items-center gap-3 ${linkClass}`}>
                  <FontAwesomeIcon icon={faPhone} className="w-4 text-white/70" />
                  <span>{SHOP_PHONE.display}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SHOP_EMAIL}`} className={`flex items-center gap-3 break-all ${linkClass}`}>
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 text-white/70" />
                  <span>{SHOP_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} North Shore Bike Shop</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 self-start rounded text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-auto"
          >
            Back to top
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Closer;
