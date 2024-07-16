import * as yup from "yup";
import { OperationType } from "./types";

export const manageCommitmentSchema = yup
  .object({
    type: yup.string().oneOf(Object.values(OperationType)).required(),
    amount: yup.number().required().positive(),
  })
  .required();
