import * as yup from "yup";
import {CID} from "multiformats/cid";

// CID validation helper
const validateCID = (value?: string) => {
    if (!value) return true; // Optional field
    try {
        CID.parse(value);
        return true;
    } catch {
        return false;
    }
};

export const profileEditSchema = yup
    .object({
        activeStep: yup.number().default(0),
        name: yup.string().trim().max(24, "Name must be 24 characters or less"),
        publicKey: yup.string().trim().required(),
        description: yup
            .string()
            .trim()
            .max(384, "Description must be 384 characters or less"),
        homepage: yup
            .string()
            .trim()
            .max(128, "Homepage URL must be 128 characters or less")
            .url("Must be a valid URL"),
        socialMediaLinks: yup
            .array()
            .of(
                yup
                    .string()
                    .trim()
                    .max(92, "Social link must be 92 characters or less")
                    .url("Must be a valid URL")
            )
            .max(3, "Maximum 3 social media links allowed"),
        avatarCid: yup
            .string()
            .trim()
            .test("is-ipfs-cid", "Invalid IPFS CID", validateCID)
            .optional()
        ,
        backgroundCid: yup
            .string()
            .trim()
            .test("is-ipfs-cid", "Invalid IPFS CID", validateCID)
            .optional()
        ,
        avatarMimeType: yup.string().default("image/jpeg"),
        backgroundMimeType: yup.string().default("image/jpeg"),
    })
    .required();
