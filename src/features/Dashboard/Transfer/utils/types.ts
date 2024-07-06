export enum Steps {
  Recipient,
  HoldingsSelection,
  MemoOptions,
  FeeSelection,
  Confirmation,
}

export const StepsAmount = 5;

export const maxMemoLength = 1000;

export type GlobalSearchParams = {
  asset?: string;
};

// Form Schemas

export type TransactionCreation = {
  activeStep: Steps;
  recipient: string;
  amount: number;
  maxAmount: number;
  asset: string;
  assetDecimals: number;
  includeMemo: boolean;
  memo: string;
  isMemoEncrypted: boolean;
  isMemoBinary: boolean;
  fee: number;
};
