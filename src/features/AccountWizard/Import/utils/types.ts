import { AccountType } from "@/types/accountType";

// Form Schemas

export type AccountImport = {
  type: AccountType;
  account: string;
  walletName: string;
  mnemonicAccountAgreement: boolean;
};
