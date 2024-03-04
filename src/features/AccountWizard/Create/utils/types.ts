export enum Steps {
  AccountCreationAgreement,
  SecretPhraseGeneration,
  SecretPhraseVerification,
}

// Form Schemas

export type AccountCreationAgreement = {
  activeStep: Steps;
  firstTerm: boolean;
  secondTerm: boolean;
  thirdTerm: boolean;
  seedPhrase: string;
  seedPhraseVerificationIndex: number;
  seedPhraseVerificationWord: string;
  walletName: string;
};
