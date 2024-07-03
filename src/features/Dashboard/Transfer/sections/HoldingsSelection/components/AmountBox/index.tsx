import { Fragment } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { formatNumber } from "@/utils/formatNumber";
import { useNumberSeparator } from "@/hooks/useNumberSeparator";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import type { TransactionCreation } from "../../../../utils/types";

export const AmountBox = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const { price, symbol } = useActiveMarketRate();
  const numberSeparator = useNumberSeparator();

  const asset = watch("asset");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  const notEnoughFunds = !!(amount && amount > maxAmount);
  const noFundsAvailable = !maxAmount;

  const isAssetSigna = asset === "0";

  const setMaxAvailableBalance = () =>
    setValue("amount", isAssetSigna ? maxAmount - 0.5 : maxAmount);

  const signaAmountMarketValue =
    isAssetSigna && amount && price ? amount * price : 0;

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

          {!!(!notEnoughFunds && signaAmountMarketValue) && (
            <Text size="large" color="muted" className="font-medium">
              {`${symbol}${formatNumber({
                value: signaAmountMarketValue,
                isFiat: true,
              })}`}
            </Text>
          )}

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
