export enum Steps {
  Recipient,
  HoldingsSelection,
  MemoOptions,
  FeeSelection,
  Confirmation,
}

// Form Schemas

export type TransactionCreation = {
  activeStep: Steps;
  recipient: string;
  amount: number;
  asset: string;
  assetDecimals: number;
  includeMemo: boolean;
  memo: string;
  isMemoEncrypted: boolean;
  isMemoBinary: boolean;
  fee: string;
};
