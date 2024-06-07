import type { Token } from "@/db/schema";
import type { LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";

export class TokenService extends LedgerSubService {
  constructor(context: LedgerServiceContext) {
    super(context);
  }

  async exists(tokenId: string) {
    try {
      await this.context.ledger.asset.getAsset({ assetId: tokenId });
      return true;
    } catch (e: any) {
      return false;
    }
  }

  fetchMetaData(tokenId: string): Promise<Token> {
    return handleError<Token>(async () => {
      const { ledger } = this.context;
      const { asset, name, description, decimals, account, issuer, mintable } =
        await ledger.asset.getAsset({
          assetId: tokenId,
        });

      return {
        id: asset,
        ticker: name,
        description,
        decimals,
        account,
        issuer,
        mintable,
      };
    });
  }

  fetchTokenPriceNQT(tokenId: string) {
    return handleError<string>(async () => {
      const { ledger } = this.context;

      const { trades } = await ledger.asset.getAssetTrades({
        assetId: tokenId,
        firstIndex: 0,
        lastIndex: 0,
      });

      if (!trades || !trades.length) return "0";

      return trades[0].price;
    });
  }
}
