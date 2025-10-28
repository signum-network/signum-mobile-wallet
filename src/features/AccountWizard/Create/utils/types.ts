export enum Steps {
  AccountCreationAgreement,
  SecretPhraseGeneration,
  SecretPhraseVerification,
}

export const StepsAmount = 3;

// Form Schemas

export type AccountCreation = {
  activeStep: Steps;
  firstTerm: boolean;
  secondTerm: boolean;
  thirdTerm: boolean;
  seedPhrase: string;
  seedPhraseVerificationIndex: number;
  seedPhraseVerificationWord: string;
  walletName: string;
};
