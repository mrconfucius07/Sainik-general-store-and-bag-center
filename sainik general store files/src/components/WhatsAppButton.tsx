import { WHATSAPP_LINK } from "@/lib/utils";

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sainik Store on WhatsApp"
      className="wa-pulse fixed bottom-5 right-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.36 4 14.95c0 2.1.56 4.14 1.63 5.95L4.06 29l8.3-2.16a12.1 12.1 0 0 0 3.68.57h.01c6.63 0 12.03-5.36 12.03-11.95C28.08 8.36 22.67 3 16.04 3Zm0 21.85h-.01a10.1 10.1 0 0 1-3.4-.59l-.24-.09-4.93 1.28 1.32-4.77-.16-.25a9.85 9.85 0 0 1-1.53-5.28c0-5.45 4.48-9.88 9.96-9.88 2.65 0 5.13 1.03 7 2.88a9.8 9.8 0 0 1 2.9 7.01c0 5.45-4.49 9.89-9.97 9.89Zm5.47-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
