import { Fragment } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import type { TransactionCreation } from "../../../../utils/types";

export const AmountBox = () => {
  const { t } = useTranslation();
  const { watch, setValue, control } = useFormContext<TransactionCreation>();

  const asset = watch("asset");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  return (
    <Fragment>
      <Card>
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t("transfer.enterAmount")}
                onBlur={onBlur}
                onChangeText={onChange}
                size="extraLarge"
                value={`${value}`}
                extraClassNames="font-medium text-center"
              />
            )}
            name="amount"
          />
        </View>
      </Card>
    </Fragment>
  );
};
