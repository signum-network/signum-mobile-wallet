import { marketStore } from "@/states/marketStore";
import { defaultCurrency, AllowedTickersSymbol } from "@/types/currencies";

export const useActiveMarketRate = () => {
  const activeCurrency = marketStore((state) => state.activeCurrency);
  const markets = marketStore((state) => state.markets);

  const symbol = AllowedTickersSymbol.get(activeCurrency || defaultCurrency);

  const currentMarket = markets[activeCurrency];

  return {
    activeCurrency,
    symbol,
    ticker: activeCurrency.toUpperCase(),
    price: currentMarket?.price || 0,
    lastUpdated: currentMarket?.lastUpdated || "",
  };
};
