import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { AttachmentMessage } from "@signumjs/core";
import { useNetworkFees } from "@/hooks/useNetworkFees";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { type TransactionCreation } from "../../utils/types";
import { SignaSymbol } from "@/components/SignaSymbol";

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

  const cheapPlanck = cheap.getPlanck();
  const standardPlanck = standard.getPlanck();
  const priorityPlanck = priority.getPlanck();

  const cheapSigna = cheap.getSigna();
  const standardSigna = standard.getSigna();
  const prioritySigna = priority.getSigna();

  const setCheapFees = () => setValue("fee", cheapPlanck);
  const setStandardFees = () => setValue("fee", standardPlanck);
  const setPriorityFees = () => setValue("fee", priorityPlanck);

  return (
    <View className="gap-4 w-full">
      <Card>
        <View className="w-full gap-4">
          <View className="flex-col w-full">
            <Text className="font-medium">
              {t("transfer.stepper.feeSelectionStepTitle")}
            </Text>

            <Text color="muted" className="font-medium">
              {t("transfer.feeSelectionDescription")}
            </Text>
          </View>

          {!Number(cheapSigna) ? (
            <ActivityIndicator size={32} />
          ) : (
            <>
              <FormCheckbox
                value={fee === cheapPlanck}
                onPress={setCheapFees}
                title={
                  <Text>
                    🕤 {t("transfer.feeMinimal")} ({cheapSigna}{" "}
                    <SignaSymbol/>)
                  </Text>
                }
                fullWidth
                bordered
              />

              <FormCheckbox
                value={fee === standardPlanck}
                onPress={setStandardFees}
                title={
                  <Text>
                    ⏩ {t("transfer.feeFast")} ({standardSigna}{" "}
                    <SignaSymbol />)
                  </Text>
                }
                fullWidth
                bordered
              />

              <FormCheckbox
                value={fee === priorityPlanck}
                onPress={setPriorityFees}
                title={
                  <Text>
                    🚀 {t("transfer.feePriority")} ({prioritySigna}{" "}
                    <SignaSymbol />)
                  </Text>
                }
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
