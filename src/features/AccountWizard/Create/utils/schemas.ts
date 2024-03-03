import * as yup from "yup";

export const accountCreationAgreementSchema = yup
  .object({
    activeStep: yup.number().default(0),
    firstTerm: yup.boolean().required(),
    secondTerm: yup.boolean().required(),
    thirdTerm: yup.boolean().required(),
    seedPhrase: yup.string().required(),
  })
  .required();
