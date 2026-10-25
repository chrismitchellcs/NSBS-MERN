/**
 * Single source for shop hours and contact details (Contact page, home page, footer). The
 * structured data in public/index.html repeats these for Google and must be updated with them.
 */
export const SHOP_HOURS = [
  { day: "Sunday", open: "11:00 AM", close: "4:00 PM" },
  { day: "Monday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Tuesday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Wednesday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Thursday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Friday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
];

export const SHOP_ADDRESS = {
  street: "1831 Lonsdale Avenue",
  city: "North Vancouver, BC",
  postalCode: "V7M 2J8",
};

export const SHOP_PHONE = { display: "(604) 929-6727", tel: "+16049296727" };

export const SHOP_EMAIL = "northshorebikeshop@gmail.com";

export const SHOP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `North Shore Bike Shop, ${SHOP_ADDRESS.street}, ${SHOP_ADDRESS.city} ${SHOP_ADDRESS.postalCode}`
)}`;

const SHOP_TIME_ZONE = "America/Vancouver";

/** "7:00 PM" → minutes after midnight (1140). */
function toMinutes(time) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(time).trim());
  if (!m) return null;
  let hours = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(m[2]);
}

/** "7:00 PM" → "7", "10:30 AM" → "10:30" for the compact summary. */
function toShortTime(time) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(time).trim());
  if (!m) return time;
  return m[2] === "00" ? m[1] : `${m[1]}:${m[2]}`;
}

/** Compact weekly summary, e.g. "Mon-Fri 11-7, Sat 10-6, Sun 11-4" (Monday-first). */
export function shopHoursSummary(hours = SHOP_HOURS) {
  const mondayFirst = [...hours.slice(1), hours[0]];
  const groups = [];
  mondayFirst.forEach((entry) => {
    const last = groups[groups.length - 1];
    if (last && last.open === entry.open && last.close === entry.close) {
      last.lastDay = entry.day;
    } else {
      groups.push({ firstDay: entry.day, lastDay: entry.day, open: entry.open, close: entry.close });
    }
  });
  return groups
    .map(({ firstDay, lastDay, open, close }) => {
      const days =
        firstDay === lastDay ? firstDay.slice(0, 3) : `${firstDay.slice(0, 3)}-${lastDay.slice(0, 3)}`;
      return `${days} ${toShortTime(open)}-${toShortTime(close)}`;
    })
    .join(", ");
}

/** Today's hours in shop (Vancouver) time and whether the shop is open right now. */
export function todayHours(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SHOP_TIME_ZONE,
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const entry = SHOP_HOURS.find((h) => h.day === day);
  if (!entry) return { day, open: null, close: null, isOpen: false, beforeOpen: false };
  const openMin = toMinutes(entry.open);
  const closeMin = toMinutes(entry.close);
  const isOpen = openMin != null && closeMin != null && minutes >= openMin && minutes < closeMin;
  const beforeOpen = openMin != null && minutes < openMin;
  return { day, open: entry.open, close: entry.close, isOpen, beforeOpen };
}

/** "7:00 PM" → "7 PM", "10:30 AM" → "10:30 AM". */
function toClock(time) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(time || "").trim());
  if (!m) return time;
  const suffix = m[3].toUpperCase();
  return m[2] === "00" ? `${m[1]} ${suffix}` : `${m[1]}:${m[2]} ${suffix}`;
}

/** One-line status for the nav: "Open until 7 PM", "Opens 11 AM", "Closed until Mon 11 AM". */
export function shopStatus(now = new Date()) {
  const today = todayHours(now);
  if (today.isOpen) return { isOpen: true, label: `Open until ${toClock(today.close)}` };
  if (today.beforeOpen) return { isOpen: false, label: `Opens ${toClock(today.open)}` };
  const i = SHOP_HOURS.findIndex((h) => h.day === today.day);
  const next = SHOP_HOURS[(i + 1) % SHOP_HOURS.length];
  return {
    isOpen: false,
    label: `Closed until ${next.day.slice(0, 3)} ${toClock(next.open)}`,
  };
}
