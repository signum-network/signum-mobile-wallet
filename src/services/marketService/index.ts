import { Http, HttpClientFactory } from "@signumjs/http";
import type { SupportedTickerSymbol } from "@/types/currencies";
import type { MarketData } from "@/types/marketData";
import { handleError } from "../ledgerService/handleError";

/**
 * API Rates provided for free by coingecko, thanks :D
 * https://www.coingecko.com/en/api
 */

export class MarketService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient(
      "https://api.coingecko.com"
    );
  }

  public getMarket(tickerSymbol: SupportedTickerSymbol) {
    return handleError<MarketData | null>(async () => {
      const { response } = await this.httpClient.get(
        `api/v3/coins/markets?vs_currency=${tickerSymbol}&ids=signum&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      if (!response) return null;
      if (!response.length) return null;
      return <MarketData>response[0];
    });
  }
}
