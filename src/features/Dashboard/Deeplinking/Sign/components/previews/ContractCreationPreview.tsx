import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {NftDescriptor} from "@/components/NftDescriptor";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    parsed: ParsedTransaction;
}

export const ContractCreationPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const expense = parsed.expenses[0];
    const isNft = parsed.transaction.attachment?.name === "NFTSRC40"

    return (
        <>
            {isNft && <NftDescriptor transaction={parsed.transaction}/>}
            {/* Contract Reference */}
            {expense.hash && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.contractReference")}
                    </Text>

                    <Card>
                        <Text className="font-medium font-mono" size="small">
                            {expense.hash}
                        </Text>
                    </Card>
                </View>
            )}


            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {t(
                        "Creating a smart contract that will be deployed to the blockchain. The initial balance will be transferred to the contract."
                    )}
                </Text>
            </Card>

            {/* Fees */}
            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
