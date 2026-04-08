import { useState, useEffect } from "react";
import { getSignedStorageUrl } from "@/lib/storage";

interface Props {
  bucket: string;
  path: string | null | undefined;
  alt?: string;
  className?: string;
}

/**
 * Renders an image from a private storage bucket using a signed URL.
 * Handles both legacy full URLs and storage paths.
 */
export default function SignedImage({
  bucket,
  path,
  alt = "",
  className,
}: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    getSignedStorageUrl(bucket, path).then(url => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [bucket, path]);

  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
