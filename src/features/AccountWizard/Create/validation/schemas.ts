import * as yup from "yup";

export const accountCreationAgreementSchema = yup
  .object({
    firstTerm: yup.boolean().required(),
    secondTerm: yup.boolean().required(),
    thirdTerm: yup.boolean().required(),
  })
  .required();
