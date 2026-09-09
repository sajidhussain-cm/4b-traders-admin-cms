"use client";

import { useEffect, useState } from "react";

export default function FlashSaleCountdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - Date.now();

      if (difference <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      }

      return {
        days: String(
          Math.floor(difference / (1000 * 60 * 60 * 24))
        ).padStart(2, "0"),

        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24)
        ).padStart(2, "0"),

        minutes: String(
          Math.floor((difference / (1000 * 60)) % 60)
        ).padStart(2, "0"),

        seconds: String(
          Math.floor((difference / 1000) % 60)
        ).padStart(2, "0"),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex justify-center gap-3 md:gap-5 mt-8">
      {[
        [timeLeft.days, "Days"],
        [timeLeft.hours, "Hours"],
        [timeLeft.minutes, "Minutes"],
        [timeLeft.seconds, "Seconds"],
      ].map(([value, label]) => (
        <div
          key={label}
          className="min-w-[68px] md:min-w-[90px] border border-maroon/15 bg-white px-3 py-4 shadow-sm"
        >
          <div className="font-serif text-2xl md:text-4xl text-maroon">
            {value}
          </div>

          <div className="text-[10px] md:text-xs uppercase tracking-wider text-charcoal/60 mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}