import * as yup from "yup";
import { AccountType } from "@/types/accountType";

export const accountImportSchema = yup
  .object({
    type: yup.string().oneOf(Object.values(AccountType)).required(),
    account: yup.string().trim().required(),
    walletName: yup.string().required(),
    mnemonicAccountAgreement: yup.boolean().required(),
  })
  .required();
