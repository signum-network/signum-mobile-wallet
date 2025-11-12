import { Image } from "react-native";
import SignumWhiteSymbol from "./signum_symbol_white.png";
import SignumBlueSymbol from "./signum_symbol_blue.png";
import WizardBanner from "./wizard-banner.png";

export const signumWhiteSymbolPicture =
  Image.resolveAssetSource(SignumWhiteSymbol).uri;

export const signumBlueSymbolPicture =
  Image.resolveAssetSource(SignumBlueSymbol).uri;

export const wizardBannerPicture = Image.resolveAssetSource(WizardBanner).uri;
