/**
 * How long a generated file's object URL stays valid after the download is
 * started. Revoking straight after click() can cancel the download in some
 * browsers (notably Safari and Firefox on mobile), which still read the blob
 * asynchronously; a minute is ample, and the URL is freed afterwards.
 */
export const REVOKE_AFTER_MS = 60_000;

/** Starts a download of an object URL, then revokes it after REVOKE_AFTER_MS. */
export function downloadObjectUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_AFTER_MS);
}
