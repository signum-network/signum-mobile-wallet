import * as yup from "yup";

export const transactionCreationSchema = yup
  .object({
    activeStep: yup.number().default(0),
    recipient: yup.string().trim().required(),
    amount: yup.number().required().positive(),
    asset: yup.string().required(),
    assetDecimals: yup.number().default(0),
    includeMemo: yup.boolean().default(false),
    memo: yup.string().trim().default(""),
    isMemoEncrypted: yup.boolean().default(false),
    isMemoBinary: yup.boolean().default(false),
    fee: yup.string().required(),
  })
  .required();
