export enum Steps {
  AccountCreationAgreement,
  SecretPhraseGeneration,
}

// Form Schemas

export type AccountCreationAgreement = {
  activeStep: Steps;
  firstTerm: boolean;
  secondTerm: boolean;
  thirdTerm: boolean;
  seedPhrase: string;
};
