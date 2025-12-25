import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useTicker} from "@/hooks/useTicker";
import {useActiveMarketRate} from "@/hooks/useActiveMarketRate";
import {formatNumber} from "@/utils/formatNumber";
import {signumBlueSymbolPicture} from "@/assets";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {TotalAmount} from "./components";

interface Props {
    parsed: ParsedTransaction;
}

export const CommitmentPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const {price, symbol} = useActiveMarketRate();

    const expense = parsed.expenses[0];
    const commitmentAmount = expense.amount ? Number(expense.amount.getSigna()) : 0;
    const marketValue = price && commitmentAmount ? commitmentAmount * price : 0;

    const isAdding = parsed.type.i18nKey === "addCommitment";

    return (
        <>
            {/* Commitment Amount */}
            <View className="w-full flex flex-col gap-1">
                <View className="flex flex-row items-center justify-start gap-2 w-full">
                    <View className="size-10">
                        <Image
                            source={{uri: signumBlueSymbolPicture}}
                            style={{width: "100%", height: "100%", borderRadius: 8}}
                        />
                    </View>

                    <View className="flex-1 flex items-start flex-col gap-1">
                        <Text className="font-medium">
                            {`${formatNumber({value: commitmentAmount})} ${NativeTicker}`}
                        </Text>

                        {!!marketValue && (
                            <Text size="small" color="muted">
                                {`${symbol}${formatNumber({value: marketValue, isFiat: true})}`}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {isAdding
                        ? t("sign.addCommitmentExplanation", {amount: commitmentAmount})
                        : t("sign.removeCommitmentExplanation", {amount: commitmentAmount})}
                </Text>
            </Card>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
