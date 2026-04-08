import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a signed URL for a private storage object.
 * Falls back gracefully if the path is already a full URL (legacy data).
 */
export async function getSignedStorageUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string | null> {
  if (!path) return null;

  // If it's already a full URL (legacy data), extract the path
  if (path.startsWith("http")) {
    const marker = `/object/public/${bucket}/`;
    const idx = path.indexOf(marker);
    if (idx !== -1) {
      path = path.substring(idx + marker.length);
    } else {
      // Can't resolve, return null
      return null;
    }
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Upload a file and return its storage path (NOT a public URL).
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Blob | File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  return path;
}

/**
 * Upload a file and immediately return a signed URL for display.
 */
export async function uploadAndSign(
  bucket: string,
  path: string,
  file: Blob | File,
  expiresIn = 3600
): Promise<{ path: string; signedUrl: string }> {
  await uploadFile(bucket, path, file);
  const signedUrl = await getSignedStorageUrl(bucket, path, expiresIn);
  if (!signedUrl) throw new Error("Failed to generate signed URL");
  return { path, signedUrl };
}
