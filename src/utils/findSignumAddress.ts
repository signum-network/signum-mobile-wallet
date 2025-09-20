const RS_RE =
  /\bS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}\b/i;

// Helper to decode Base64 or Base64URL into a UTF-8 string
function decodeBase64Url(b64: string): string {
  // Replace URL-safe chars and restore padding
  const base64 = b64.replace(/-/g, "+").replace(/_/g, "/")
                   + "===".slice((b64.length + 3) % 4);

  if (typeof atob === "function") {
    // Browser / React Native: atob returns binary string
    const bin = atob(base64);
    // Convert binary string to UTF-8
    let out = "";
    for (let i = 0; i < bin.length; i++) {
      out += "%" + bin.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return decodeURIComponent(out);
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function findSignumAddress(input: string): string | null {
  const str = decodeURIComponent(input.trim());

  // 1) Try parsing as signum:// deeplink
  try {
    // Normalize the URL so `new URL()` can parse it
    const normalized = str.replace(/^web\+/, "").replace(/^signum:/i, "signum://");
    const u = new URL(normalized);

    // v1 deeplink: address is inside Base64/JSON payload
    const payload = u.searchParams.get("payload");
    if (payload) {
      try {
        const obj = JSON.parse(decodeBase64Url(payload));
        const cand: string | undefined = obj?.recipient;
        if (cand && RS_RE.test(cand)) return cand.toUpperCase();
      } catch {
        // Ignore JSON/base64 decoding errors
      }
    }

    // Legacy deeplink: ?recipient=... or last path segment
    const candidate = u.searchParams.get("recipient") || u.pathname.split("/").pop() || "";
    if (RS_RE.test(candidate)) return candidate.toUpperCase();
  } catch {
    // Not a valid URL format — will try other methods
  }

  // 2) Fallback: input might be raw Base64/JSON without a URL
  try {
    const obj = JSON.parse(decodeBase64Url(str));
    const cand: string | undefined = obj?.recipient;
    if (cand && RS_RE.test(cand)) return cand.toUpperCase();
  } catch {
    // Ignore if not Base64/JSON
  }

  // 3) Final fallback: match raw text for an S-... address
  const m = str.match(RS_RE);
  return m ? m[0].toUpperCase() : null;
}
