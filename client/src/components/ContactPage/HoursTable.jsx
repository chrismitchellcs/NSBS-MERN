import { Fragment } from "react";

const hours = [
  { day: "Sunday", open: "11:00 AM", close: "4:00 PM" },
  { day: "Monday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Tuesday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Wednesday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Thursday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Friday", open: "11:00 AM", close: "7:00 PM" },
  { day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
];

const HoursTable = () => {
  return (
    <div className="h-full w-full rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-md ">
      <div className="border-b border-white/10 px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
        Hours
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-6 gap-y-3 text-sm text-slate-100 sm:text-base">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            Day
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            Open
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            Close
          </div>
          {hours.map((hour) => (
            <Fragment key={hour.day}>
              <div className="font-medium text-white">{hour.day}</div>
              <div className="font-light text-slate-100">{hour.open}</div>
              <div className="font-light text-slate-100">{hour.close}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoursTable;
