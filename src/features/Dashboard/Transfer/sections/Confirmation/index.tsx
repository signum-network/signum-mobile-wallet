import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {useFormContext} from "react-hook-form";
import {Amount, ChainValue} from "@signumjs/util";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {Button} from "@/components/Button";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {openTransactionLink} from "@/utils/explorer/openLink";
import {type TransactionCreation} from "../../utils/types";
import {ResolvingAccountCard} from "../../components/ResolvingAccountCard";
import {BurnWarning} from "@/components/BurnWarning";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import {SignaDescriptor} from "@/components/SignaDescriptor";
import {TokenDescriptor} from "@/components/TokenDescriptor";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    onSubmit: () => void;
    isComplete: boolean;
    disableOnSubmit: boolean;
    transactionId: string;
}

export const Confirmation = ({
                                 onSubmit,
                                 isComplete,
                                 disableOnSubmit,
                                 transactionId,
                             }: Props) => {
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();
    const {watch} = useFormContext<TransactionCreation>();

    const asset = watch("asset");
    const amount = watch("amount");
    const includeMemo = watch("includeMemo");
    const memo = watch("memo");
    const isMemoBinary = watch("isMemoBinary");
    const isMemoEncrypted = watch("isMemoEncrypted");
    const fee = watch("fee");
    const recipient = watch("recipient")

    const {decimals} = useTokenMetadata(asset);

    const isAssetSigna = asset === "0";
    const feeAmount = Amount.fromPlanck(fee ?? "0");
    const signaAmount = Amount.fromSigna(amount);
    const totalAmount = signaAmount.clone().add(feeAmount);

    const copyTransactionId = async () => {
        await Clipboard.setStringAsync(transactionId);
        alert(t("overview.copiedTransactionId"));
    };

    const openTransactionInExplorer = () => openTransactionLink(transactionId);

    return (
        <View className="gap-4 w-full">
            <Card>
                {isComplete && (
                    <Card>
                        <View className="w-full flex flex-col items-center gap-1">
                            <Ionicons name="checkmark-circle" size={65} color={iconColor.green}/>

                            <Text
                                fullWidth
                                className="text-center"
                                color="success"
                                size="large"
                            >
                                {t("transfer.signedTransactionTitle")}
                            </Text>

                            <Text fullWidth className="text-center" color="muted">
                                {t("transfer.signedTransactionDescription")}
                            </Text>
                        </View>

                        {transactionId && (
                            <View className="w-full flex flex-col items-center justify-center gap-4 px-4">
                                <Button
                                    type="blackout"
                                    title={t("overview.copyTransactionId")}
                                    pressableProps={{onPress: copyTransactionId}}
                                    fullWidth
                                    size="small"
                                    icon={
                                        <Ionicons
                                            name="copy"
                                            size={18}
                                            color={iconColor.blackout}
                                        />
                                    }
                                    wide
                                />

                                <Button
                                    type="primary"
                                    title={t("overview.viewInExplorer")}
                                    pressableProps={{onPress: openTransactionInExplorer}}
                                    fullWidth
                                    size="small"
                                    icon={<Ionicons name="link" size={18} color="white"/>}
                                    wide
                                />
                            </View>
                        )}
                    </Card>
                )}

                <View className="w-full flex flex-col gap-1 text-left">
                    <Text size="large" color="muted" className="font-bold">
                        {t("recipient")}
                    </Text>
                    <ResolvingAccountCard recipient={recipient}/>
                </View>

                {/* Burn Address Warning */}
                {(recipient === "0" || recipient?.includes("2222-2222-2222-2222")) && (
                    <BurnWarning />
                )}

                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("amount")}
                    </Text>

                    <View className="flex flex-row items-center justify-start gap-2 w-full">
                        {isAssetSigna ? (
                            <SignaDescriptor amount={signaAmount}/>
                        ) : (
                            <TokenDescriptor tokenId={asset}
                                             quantity={ChainValue
                                                 .create(decimals)
                                                 .setCompound(amount)
                                                 .getAtomic()
                            }/>
                        )}

                    </View>
                </View>

                <TotalAmount fee={feeAmount} total={totalAmount} />

                {includeMemo && (
                    <View className="w-full flex flex-col gap-1">
                        <Text size="large" color="muted" className="font-bold">
                            {t("textOrMemo")}
                        </Text>

                        {isMemoEncrypted && (
                            <Text fullWidth color="success" size="small">
                                🔐 {t("transfer.memoIsEncrypted")}
                            </Text>
                        )}

                        {isMemoBinary ? (
                            <Text fullWidth color="primary" size="small">
                                🤖 {t("transfer.memoIsBinary")}
                            </Text>
                        ) : (
                            <Text fullWidth color="muted" size="small">
                                {memo}
                            </Text>
                        )}
                    </View>
                )}
            </Card>

            {!isComplete && (
                <Card>
                    <Text color="muted" className="text-center" fullWidth>
                        {t("transfer.pressTheButtonLonger")}
                    </Text>

                    <Button
                        icon={<Ionicons name="send" size={24} color={iconColor.default}/>}
                        type="primary"
                        size="large"
                        title={t("transfer.confirmTransaction")}
                        pressableProps={{
                            delayLongPress: 2000,
                            onLongPress: onSubmit,
                            disabled: disableOnSubmit,
                        }}
                        fullWidth
                    />
                </Card>
            )}
        </View>
    );
};
