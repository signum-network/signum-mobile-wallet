import {HttpError} from "@signumjs/http";


const ERROR_CODES = {
    1: "invalidRequest",
    3: "incompleteParameters",
    4: "incorrectAccount",
    5: "unknownAccount",
    6: "insufficientFunds",
    7: "notAllowed",
    8: "processingError",
    9: "featureNotAvailable",
}

export class LedgerError extends Error {
    code?: number;
    cause?: unknown;

    constructor(message: string, opts?: { code?: number; cause?: unknown }) {
        super(message);
        this.name = "LedgerError";
        this.code = opts?.code;
        this.cause = opts?.cause;
    }
}

type LedgerCallFunction<T> = (...args: any[]) => Promise<T>;

export async function handleError<T = string>(fn: LedgerCallFunction<T>) {
    try {
        return await fn();
    } catch (e: any) {
        // If it is NOT an HttpError -> rethrow the original error
        if (!(e instanceof HttpError)) {
            throw e;
        }

        // Normalize HttpError
        const code = e?.data?.errorCode as number | undefined;
        let message: string =
            e?.data?.errorDescription || e?.message || "unknownError";

        // Map known codes
        // @ts-ignore
        const error = code ? ERROR_CODES[code] : undefined;
        if (error) {
            message = error;
        }

        // Ledger error with additional information
        throw new LedgerError(message, {code, cause: e});
    }
}
