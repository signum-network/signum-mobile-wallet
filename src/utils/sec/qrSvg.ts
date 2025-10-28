import qrcode from "qrcode-generator";

/**
 * Build crisp SVG rects (no strokes) for a QR code.
 * - Integer grid, no antialiasing issues
 * - Returns both inner <rect> markup and moduleCount
 */
export function buildQrSvg(value: string, ecc: "L" | "M" | "Q" | "H" = "M") {
  // typeNumber=0 lets the lib choose the smallest fitting version
  const qr = qrcode(0, ecc);
  qr.addData(value);
  qr.make();

  const moduleCount = qr.getModuleCount(); // e.g., 21, 25, 29, ...
  let paths: string[] = [];

  // We emit <rect> of size 1×1 with integer x/y => crisp when scaled by integers
  for (let y = 0; y < moduleCount; y++) {
    let runStart = -1;
    for (let x = 0; x < moduleCount; x++) {
      const dark = qr.isDark(y, x);
      if (dark && runStart === -1) runStart = x;
      if ((!dark || x === moduleCount - 1) && runStart !== -1) {
        // close run
        const endX = dark && x === moduleCount - 1 ? x + 1 : x;
        const width = endX - runStart;
        paths.push(`<rect x="${runStart}" y="${y}" width="${width}" height="1" fill="#000"/>`);
        runStart = -1;
      }
    }
  }

  return { moduleCount, paths: paths.join("") };
}
