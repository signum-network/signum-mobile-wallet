import * as yup from "yup";

export const addNodeSchema = yup
  .object({
    name: yup.string().trim().required(),
    url: yup.string().trim().required(),
  })
  .required();
