import { type LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";
import { type Token } from "@/db/schema";

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
      const { asset, name, description, decimals, issuer, mintable } =
        await ledger.asset.getAsset({
          assetId: tokenId,
        });

      return {
        id: asset,
        ticker: name,
        description,
        decimals,
        issuer,
        mintable,
      };
    });
  }
}
