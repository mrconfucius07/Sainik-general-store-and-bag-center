import Image from "next/image";
import { cn } from "@/lib/utils";

/** Uses next/image (optimized, lazy) for remote URLs and a lazy <img> for base64 uploads. */
export default function SmartImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 33vw",
  fill = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}) {
  if (!src) return <div className={cn("bg-[#F1EEE6]", className)} aria-hidden />;
  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={cn("object-cover", className)} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      className={cn("object-cover", className)}
    />
  );
}
