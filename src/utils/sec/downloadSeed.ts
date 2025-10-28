import { Platform } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

interface Params {
  seed: string;
  accountAddress: string;
  title: string;
  description: string;
  secondDescription: string;

  // SVG path variant (recommended for print)
  qrCodePaths: string;       // inner <rect> markup
  moduleCount: number;       // modules per side (from buildQrSvg)

  // Tuning (optional)
  quietZoneModules?: number; // default 4
  moduleSizePx?: number;     // default 7
}

export const downloadSeed = async ({
  seed,
  accountAddress,
  title,
  description,
  secondDescription,
  qrCodePaths,
  moduleCount,
  quietZoneModules = 4,
  moduleSizePx = 7,
}: Params) => {
  // pixel-perfect sizing
  const totalModules = moduleCount + quietZoneModules * 2;
  const sizePx = totalModules * moduleSizePx;

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
      <style>
        /* keep crisp edges in print engines */
        html, body { background:#fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        svg { image-rendering: pixelated; }
      </style>
    </head>
    <body style="text-align:center;background:#fff;">
      <svg fill="none" style="width:350px;margin-top:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469 121" aria-hidden="true">
        <path d="M120.46 59.6..." fill="#333"/></svg>

      <h1 style="font-size:30px;font-family:Helvetica Neue, Arial, sans-serif;font-weight:bold;">${title}</h1>
      <p style="font-size:24px;font-family:Helvetica Neue, Arial, sans-serif;">Account Address: ${accountAddress}</p>

      <p style="font-size:28px;font-family:Helvetica Neue, Arial, sans-serif;font-weight:bold;text-align:justify;padding:16px;border:1px solid #808080;word-spacing:10px;max-width:85%;margin:0 auto;">
        ${seed}
      </p>

      <div style="width:${sizePx}px;height:${sizePx}px;margin:16px auto;">
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${sizePx}" height="${sizePx}"
             viewBox="0 0 ${totalModules} ${totalModules}"
             shape-rendering="crispEdges" aria-label="QR code">
          <rect x="0" y="0" width="${totalModules}" height="${totalModules}" fill="#fff"/>
          <g transform="translate(${quietZoneModules}, ${quietZoneModules})">
            ${qrCodePaths}
          </g>
        </svg>
      </div>

      <p style="font-size:22px;font-family:Helvetica Neue, Arial, sans-serif;font-weight:bold;text-align:justify;max-width:90%;margin:0 auto;">
        ${description}
      </p>
      <p style="font-size:20px;font-family:Helvetica Neue, Arial, sans-serif;text-align:justify;max-width:90%;margin:0 auto;">
        ${secondDescription}
      </p>
    </body>
  </html>`;

  if (Platform.OS === "ios") {
    await Print.printAsync({ html });
  } else {
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { mimeType: "application/pdf", dialogTitle: title });
  }
};
