import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Amount } from "@signumjs/util";
import { AttachmentMessage } from "@signumjs/core";
import { useNetworkFees } from "@/hooks/useNetworkFees";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { type TransactionCreation } from "../../utils/types";

export const FeeSelection = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const fee = watch("fee");
  const memo = watch("memo");
  const includeMemo = watch("includeMemo");
  const isMemoBinary = watch("isMemoBinary");

  const attachment = includeMemo
    ? new AttachmentMessage({
        messageIsText: !isMemoBinary,
        message: memo,
      })
    : undefined;

  const { cheap, standard, priority } = useNetworkFees({ attachment });

  const setCheapFees = () => setValue("fee", cheap);
  const setStandardFees = () => setValue("fee", standard);
  const setPriorityFees = () => setValue("fee", priority);

  return (
    <View className="gap-4 w-full">
      <Card>
        <View className="w-full gap-4">
          <View className="flex-col items-center w-full">
            <Text className="font-medium">
              {t("transfer.stepper.feeSelectionStepTitle")}
            </Text>

            <Text color="muted" className="font-medium">
              {t("transfer.feeSelectionDescription")}
            </Text>
          </View>

          {!cheap ? (
            <ActivityIndicator size={32} />
          ) : (
            <>
              <FormCheckbox
                value={fee === cheap}
                onPress={setCheapFees}
                title={`🕤 ${t("transfer.feeMinimal")} (${Amount.fromPlanck(
                  cheap
                ).getSigna()} Ꞩ)`}
                fullWidth
                bordered
              />

              <FormCheckbox
                value={fee === standard}
                onPress={setStandardFees}
                title={`⏩ ${t("transfer.feeFast")} (${Amount.fromPlanck(
                  standard
                ).getSigna()} Ꞩ)`}
                fullWidth
                bordered
              />

              <FormCheckbox
                value={fee === priority}
                onPress={setPriorityFees}
                title={`🚀 ${t("transfer.feePriority")} (${Amount.fromPlanck(
                  priority
                ).getSigna()} Ꞩ)`}
                fullWidth
                bordered
              />
            </>
          )}
        </View>
      </Card>
    </View>
  );
};
