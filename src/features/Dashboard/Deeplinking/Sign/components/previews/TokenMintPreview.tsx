import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {TokenDescriptor, TotalAmount} from "./components"

interface Props {
    parsed: ParsedTransaction;
}

export const TokenMintPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const expense = parsed.expenses[0];
    return (
        <>
            {/* Token Being Minted */}
            <Text size="large" color="muted" className="font-bold">
                {t("sign.mintingQuantity")}
            </Text>
            <TokenDescriptor tokenId={expense.tokenId ?? "0"} quantity={expense.quantity}/>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
