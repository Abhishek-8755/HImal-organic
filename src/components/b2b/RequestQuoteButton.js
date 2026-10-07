"use client";

import { useQuote } from "@/components/b2b/QuoteProvider";

// Opens the quote modal with no products prefilled (the buyer picks them inside)
export default function RequestQuoteButton({ className = "", children = "Request a Quote" }) {
  const { openQuote } = useQuote();
  return (
    <button type="button" onClick={() => openQuote()} className={className}>
      {children}
    </button>
  );
}
