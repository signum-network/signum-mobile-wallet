import * as yup from "yup";

export const accountCreationSchema = yup
  .object({
    activeStep: yup.number().default(0),
    firstTerm: yup.boolean().required(),
    secondTerm: yup.boolean().required(),
    thirdTerm: yup.boolean().required(),
    seedPhrase: yup.string().required(),
    seedPhraseVerificationIndex: yup.number().default(0),
    seedPhraseVerificationWord: yup.string().required(),
    walletName: yup.string().required(),
  })
  .required();
