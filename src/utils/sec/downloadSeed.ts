import * as Print from "expo-print";
import { Asset } from "expo-asset";
import { shareAsync } from "expo-sharing";
import { manipulateAsync } from "expo-image-manipulator";

const signumBlackLogoAsset = Asset.fromModule(
  require("../../assets/signum_logo_black.png")
);

interface Params {
  seed: string;
  accountAddress: string;
  title: string;
  description: string;
  secondDescription: string;
  qrCodePaths: string;
}

export const downloadSeed = async ({
  seed,
  accountAddress,
  title,
  description,
  secondDescription,
  qrCodePaths,
}: Params) => {
  const image = await manipulateAsync(
    signumBlackLogoAsset.localUri ?? signumBlackLogoAsset.uri,
    [],
    { base64: true }
  );

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>

      <body style="text-align: center;">
        <img src="data:image/jpeg;base64,${image.base64}" style="width: 80vw;" />

        <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;">
        ${title}
        </h1>

        <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
        Account Address: ${accountAddress}
        </p>

        <p style="font-size: 28px; font-family: Helvetica Neue; font-weight: bold; text-align: justify; padding: 16px; border: 1px solid #808080; word-spacing: 10px; max-width: 85%; margin-left: auto; margin-right: auto;">
        ${seed}
        </p>

        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 37 37" fill="#ffffff">
          ${qrCodePaths}
        </svg>

        <p style="font-size: 22px; font-family: Helvetica Neue; font-weight: bold; text-align: justify; max-width: 90%; margin-left: auto; margin-right: auto;">
        ${description}
        </p>

        <p style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal; text-align: justify; max-width: 90%; margin-left: auto; margin-right: auto;">
        ${secondDescription}
        </p>

      </body>
    </html>
    `;

  const { uri } = await Print.printToFileAsync({ html });
  await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};
