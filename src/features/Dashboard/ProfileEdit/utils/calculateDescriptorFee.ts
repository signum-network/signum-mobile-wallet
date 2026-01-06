import {src44} from "@signumjs/standards";

export const calculateDescriptorFee = (data: src44.DescriptorData): string => {
    const length = data.stringify().length;

    const baseFee = 1_000_000; // 0.01 SIGNA
    const maxFee = 6_000_000; // 0.06 SIGNA

    if (length <= 0) return baseFee.toString();
    if (length >= 900) return maxFee.toString();

    const feeRange = maxFee - baseFee;
    const fee = baseFee + Math.floor((length / 900) * feeRange);

    // Round up to 3 decimal places (0.001 SIGNA = 100_000 base units)
    const precision = 100_000; // 0.001 SIGNA
    const rounded = Math.ceil(fee / precision) * precision;

    return rounded.toString();
};
