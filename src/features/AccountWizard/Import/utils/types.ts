import { AccountType } from "@/types/account";

// Form Schemas

export type AccountImport = {
  type: AccountType;
  account: string;
  isAccountValid: boolean;
  walletName: string;
  mnemonicAccountAgreement: boolean;
};
