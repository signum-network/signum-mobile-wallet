const RS_RE =
  /\bT?S-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}\b/i;

//1–20 digit numeric Signum ID
const ID_RE = /\b\d{1,20}\b/;

// Helper to decode Base64 or Base64URL into a UTF-8 string
function decodeBase64Url(b64: string): string {
  // Replace URL-safe chars and restore padding
  const base64 =
    b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4);

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

function pickAddressOrId(text: string): string | null {
  // Bevorzugt RS-Adresse
  const rs = text.match(RS_RE);
  if (rs) return rs[0].toUpperCase();

  // Fallback: numerische ID (1–19 Ziffern)
  const id = text.match(ID_RE);
  return id ? id[0] : null;
}

export function findSignumAddress(input: string): string | null {
  const str = decodeURIComponent(input.trim());

  // 1) Try parsing as signum:// deeplink
  try {
    // Normalize the URL so `new URL()` can parse it
    const normalized = str.replace(/^web\+/, "").replace(/^signum:/i, "signum://");
    const u = new URL(normalized);

    // v1 deeplink: address/ID is inside Base64/JSON payload
    const payload = u.searchParams.get("payload");
    if (payload) {
      try {
        const obj = JSON.parse(decodeBase64Url(payload));
        const candRaw: unknown = obj?.recipient;
        const cand = candRaw == null ? "" : String(candRaw);
        const picked = pickAddressOrId(cand);
        if (picked) return picked;
      } catch {
        // Ignore JSON/base64 decoding errors
      }
    }

    // Legacy deeplink: ?recipient=... or last path segment
    const candidate =
      u.searchParams.get("recipient") || u.pathname.split("/").pop() || "";
    const picked = pickAddressOrId(candidate);
    if (picked) return picked;
  } catch {
    // Not a valid URL format — will try other methods
  }

  // 2) Fallback: input might be raw Base64/JSON without a URL
  try {
    const obj = JSON.parse(decodeBase64Url(str));
    const candRaw: unknown = obj?.recipient;
    const cand = candRaw == null ? "" : String(candRaw);
    const picked = pickAddressOrId(cand);
    if (picked) return picked;
  } catch {
    // Ignore if not Base64/JSON
  }

  // 3) Final fallback: scan raw text for RS or numeric ID
  return pickAddressOrId(str);
}
