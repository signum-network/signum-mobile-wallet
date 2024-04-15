import { useQuery } from "@tanstack/react-query";
import { marketStore } from "@/states/marketStore";
import { MarketService } from "@/services/marketService";
import { differenceInMinutes } from "date-fns";

const marketService = new MarketService();

export const MarketInitializer = () => {
  const markets = marketStore((state) => state.markets);
  const activeCurrency = marketStore((state) => state.activeCurrency);
  const updateMarketRate = marketStore((state) => state.updateMarketRate);

  const currentMarket = markets[activeCurrency];

  useQuery({
    queryKey: ["fetchMarketRate", activeCurrency],
    queryFn: async () => {
      // Check if the last request happened 7 minutes ago

      if (currentMarket.lastUpdated) {
        const currentDate = new Date();
        const lastRequestDate = new Date(currentMarket.lastUpdated);

        if (differenceInMinutes(currentDate, lastRequestDate) < 7) return false;
      }

      const publicMarketData = await marketService.getMarket(activeCurrency);

      if (!publicMarketData) return false;

      updateMarketRate({
        id: activeCurrency,
        price: publicMarketData.current_price,
        lastUpdated: publicMarketData.last_updated,
      });

      return true;
    },
    refetchInterval: 120_000,
    staleTime: 120_000,
  });

  return null;
};
