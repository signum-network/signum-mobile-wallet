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
import { PUBLIC_RESERVED_SIGNA_FOR_TX_FEE } from "@/types/constants";
import { useAccount } from "@/hooks/useAccount";

export const AmountBox = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const { price, symbol } = useActiveMarketRate();
  const numberSeparator = useNumberSeparator();

  const {
    accountData: { balance },
  } = useAccount();
  const signaAvailableBalance =
    balance?.availableBalance?.getSigna
      ? Number(balance.availableBalance.getSigna())
      : 0;

  const asset = watch("asset");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  const isAssetSigna = asset === "0";
  const amountNum = Number(amount) || 0;
  const maxNum = Number(maxAmount) || 0;

  const available = Math.max(
    maxNum - (isAssetSigna ? PUBLIC_RESERVED_SIGNA_FOR_TX_FEE : 0),
    0
  );

  const notEnoughFunds = amountNum > 0 && amountNum > available;
  const noFundsAvailable = available === 0;

  const setMaxAvailableBalance = () => setValue("amount", available);

  const signaAmountMarketValue =
    isAssetSigna && amount && price ? amount * price : 0;

  const insufficientFeeFunds =
    !isAssetSigna &&
    signaAvailableBalance < PUBLIC_RESERVED_SIGNA_FOR_TX_FEE;

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
                returnKeyType="done"
                placeholder={t("transfer.enterAmount")}
                size="large"
                textAlign="center"
                extraClassNames="font-medium"
              />
            )}
          />

          {!!(!notEnoughFunds && signaAmountMarketValue) && (
            <Text size="large" color="muted" className="font-medium text-center">
              {`${symbol}${formatNumber({
                value: signaAmountMarketValue,
                isFiat: true,
              })}`}
            </Text>
          )}

          {(notEnoughFunds && !insufficientFeeFunds) && (
            <Text color="error" className="font-medium text-center">
              {t("notEnoguhFunds")}
            </Text>
          )}
          {(!notEnoughFunds && insufficientFeeFunds) && (
            <Text color="error" className="font-medium text-center">
               {t("notEnoughForFee")}
            </Text>
          )}

          <Button
            type="secondary"
            disabled={noFundsAvailable}
            title={t("maxButton")}
            size="small"
            extraClassNames="mt-2 px-4"
            pressableProps={{ onPress: setMaxAvailableBalance }}
          />
        </View>
      </Card>
    </Fragment>
  );
};
