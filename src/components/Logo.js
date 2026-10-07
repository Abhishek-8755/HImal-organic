import Link from "next/link";
import { MountainSnow } from "lucide-react";

export default function Logo({ className = "", onClick }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[1.35rem] font-semibold tracking-tight ${className}`}
    >
      <MountainSnow aria-hidden="true" className="size-7" strokeWidth={1.75} />
      Himal Organic
    </Link>
  );
}
