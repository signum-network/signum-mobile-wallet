import * as yup from "yup";
import { AccountType } from "@/types/account";

export const accountImportSchema = yup
  .object({
    type: yup.string().oneOf(Object.values(AccountType)).required(),
    account: yup.string().trim().required(),
    isAccountValid: yup.boolean().required(),
    walletName: yup.string().required(),
    mnemonicAccountAgreement: yup.boolean().required(),
  })
  .required();
