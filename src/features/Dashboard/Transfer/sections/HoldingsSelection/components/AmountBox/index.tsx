import { Fragment } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { useNumberSeparator } from "@/hooks/useNumberSeparator";
import type { TransactionCreation } from "../../../../utils/types";

export const AmountBox = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const numberSeparator = useNumberSeparator();

  const asset = watch("asset");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  const notEnoughFunds = !!(amount && amount > maxAmount);
  const noFundsAvailable = !maxAmount;

  const setMaxAvailableBalance = () => {
    setValue("amount", asset === "0" ? maxAmount - 0.5 : maxAmount);
  };

  return (
    <Fragment>
      <Card>
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <Text className="font-medium">{t("amount")}</Text>

          <NumericFormat
            value={amount}
            displayType="text"
            valueIsNumericString
            allowLeadingZeros
            allowNegative={false}
            thousandSeparator={numberSeparator.thousand || ","}
            decimalSeparator={numberSeparator.decimal || "."}
            decimalScale={8}
            onChange={undefined}
            onValueChange={(values) => {
              // @ts-expect-error allow the user to enter a decimal separator
              setValue("amount", values.value);
            }}
            renderText={(value) => (
              <TextInput
                value={value ?? ""}
                onChangeText={(data) => {
                  // @ts-expect-error allow the user to enter a decimal separator
                  setValue("amount", data);
                }}
                keyboardType="numeric"
                placeholder={t("transfer.enterAmount")}
                size="extraLarge"
                textAlign="center"
                extraClassNames="font-medium"
              />
            )}
          />

          {notEnoughFunds && (
            <Text color="error" className="font-medium">
              {t("notEnoguhFunds")}
            </Text>
          )}

          <Button
            type="secondary"
            disabled={noFundsAvailable}
            title={t("maxButton")}
            size="small"
            extraClassNames="mt-2"
            pressableProps={{ onPress: setMaxAvailableBalance }}
          />
        </View>
      </Card>
    </Fragment>
  );
};
