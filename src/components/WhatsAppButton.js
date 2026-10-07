import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppLink({ message: "I'd like to know more about your products." })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center rounded-full bg-moss text-white shadow-lg shadow-forest/25 transition-[background-color,box-shadow] duration-300 hover:bg-forest hover:shadow-xl md:bottom-6 md:right-6"
    >
      {/* Gentle pulse ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-moss opacity-40 motion-safe:animate-ping group-hover:hidden"
        style={{ animationDuration: "2.4s" }}
      />
      <span className="relative grid size-14 place-items-center">
        <MessageCircle className="size-6" aria-hidden="true" />
      </span>
      {/* Label expands on hover (desktop) */}
      <span className="relative grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap font-semibold">
          <span className="pr-6">Chat with us</span>
        </span>
      </span>
    </a>
  );
}
