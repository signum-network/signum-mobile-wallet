export enum SupportedTickerSymbol {
  BTC = "btc",
  ETH = "eth",
  LTC = "ltc",
  BCH = "bch",
  BNB = "bnb",
  EOS = "eos",
  XRP = "xrp",
  XLM = "xlm",
  LINK = "link",
  DOT = "dot",
  YFI = "yfi",
  USD = "usd",
  AED = "aed",
  ARS = "ars",
  AUD = "aud",
  BDT = "bdt",
  BHD = "bhd",
  BMD = "bmd",
  BRL = "brl",
  CAD = "cad",
  CHF = "chf",
  CLP = "clp",
  CNY = "cny",
  CZK = "czk",
  DKK = "dkk",
  EUR = "eur",
  GBP = "gbp",
  HKD = "hkd",
  HUF = "huf",
  IDR = "idr",
  ILS = "ils",
  INR = "inr",
  JPY = "jpy",
  KRW = "krw",
  KWD = "kwd",
  LKR = "lkr",
  MMK = "mmk",
  MXN = "mxn",
  MYR = "myr",
  NGN = "ngn",
  NOK = "nok",
  NZD = "nzd",
  PHP = "php",
  PKR = "pkr",
  PLN = "pln",
  RUB = "rub",
  SAR = "sar",
  SEK = "sek",
  SGD = "sgd",
  THB = "thb",
  TRY = "try",
  TWD = "twd",
  UAH = "uah",
  VEF = "vef",
  VND = "vnd",
  ZAR = "zar",
  XDR = "xdr",
  XAG = "xag",
  XAU = "xau",
  BITS = "bits",
  SATS = "sats",
}

export const DefaultAllowedTickers: SupportedTickerSymbol[] = [
  SupportedTickerSymbol.BTC,
  SupportedTickerSymbol.USD,
  SupportedTickerSymbol.EUR,
  SupportedTickerSymbol.RUB,
  SupportedTickerSymbol.BRL,
  SupportedTickerSymbol.GBP,
  SupportedTickerSymbol.CAD,
  SupportedTickerSymbol.IDR,
  SupportedTickerSymbol.THB,
  SupportedTickerSymbol.UAH,
];

const defaultFIATDecimals = 2;

// For getting decimals units, go to this link https://docs.adyen.com/development-resources/currency-codes
export const AllowedTickersDecimals = new Map([
  [SupportedTickerSymbol.BTC, 8],
  [SupportedTickerSymbol.USD, defaultFIATDecimals],
  [SupportedTickerSymbol.EUR, defaultFIATDecimals],
  [SupportedTickerSymbol.RUB, defaultFIATDecimals],
  [SupportedTickerSymbol.BRL, defaultFIATDecimals],
  [SupportedTickerSymbol.GBP, defaultFIATDecimals],
  [SupportedTickerSymbol.CAD, defaultFIATDecimals],
  [SupportedTickerSymbol.IDR, 0],
  [SupportedTickerSymbol.THB, defaultFIATDecimals],
  [SupportedTickerSymbol.UAH, defaultFIATDecimals],
]);

export const AllowedTickersSymbol = new Map([
  [SupportedTickerSymbol.BTC, "฿"],
  [SupportedTickerSymbol.USD, "$"],
  [SupportedTickerSymbol.EUR, "€"],
  [SupportedTickerSymbol.RUB, "₽"],
  [SupportedTickerSymbol.BRL, "R$"],
  [SupportedTickerSymbol.GBP, "£"],
  [SupportedTickerSymbol.CAD, "C$"],
  [SupportedTickerSymbol.IDR, "Rp"],
  [SupportedTickerSymbol.THB, "฿"],
  [SupportedTickerSymbol.UAH, "₴"],
]);

export const defaultCurrency: SupportedTickerSymbol = SupportedTickerSymbol.USD;

export type Market = {
  id: SupportedTickerSymbol;
  price: number;
  lastUpdated: string;
};

export const defaultMarket: Market = {
  id: defaultCurrency,
  price: 0,
  lastUpdated: "",
};
