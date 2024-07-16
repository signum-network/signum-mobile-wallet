import { Fragment, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useAccount } from "@/hooks/useAccount";
import { useTicker } from "@/hooks/useTicker";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNumberSeparator } from "@/hooks/useNumberSeparator";
import { WatchOnlyAccountCard } from "@/components/Account/WatchOnlyAccountCard";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { OperationType, type ManageCommitment } from "../../utils/types";

import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  onSubmit: () => void;
}

export const Operation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { iconColor } = useAppTheme();
  const { isWatchOnly } = useAccount();
  const { ledgerService } = useLedgerService();
  const { watch, setValue, resetField } = useFormContext<ManageCommitment>();
  const numberSeparator = useNumberSeparator();

  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  const type = watch("type");
  const isOperationTypeAdd = type === OperationType.Add;
  const isOperationTypeRemove = type === OperationType.Remove;

  const setAddMode = () => setValue("type", OperationType.Add);
  const setRemoveMode = () => setValue("type", OperationType.Remove);

  useEffect(() => {
    resetField("amount");
    resetField("maxAmount");
  }, [type]);

  const setMaxAvailableBalance = () => {};

  const disableOnSubmit = true;

  if (isWatchOnly) {
    return (
      <Card>
        <WatchOnlyAccountCard />
      </Card>
    );
  }

  return (
    <Fragment>
      <View className="flex flex-row items-center justify-center bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg max-w-md mx-auto w-full">
        <Button
          icon={
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={isOperationTypeAdd ? "white" : iconColor.default}
            />
          }
          type={isOperationTypeAdd ? "primary" : undefined}
          title={t("add")}
          extraClassNames="!rounded-r-none w-1/2"
          size="large"
          pressableProps={{ onPress: setAddMode }}
        />

        <Button
          icon={
            <Ionicons
              name="remove-circle-outline"
              size={24}
              color={isOperationTypeRemove ? "white" : iconColor.default}
            />
          }
          type={isOperationTypeRemove ? "primary" : undefined}
          title={t("remove")}
          extraClassNames="!rounded-l-none w-1/2"
          size="large"
          pressableProps={{ onPress: setRemoveMode }}
        />
      </View>

      <Card>
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <Text fullWidth className="text-center font-medium">
            {t(
              isOperationTypeAdd
                ? "commitment.howMuchToCommit"
                : "commitment.howMuchToUnCommit",
              { ticker: NativeTicker }
            )}
          </Text>

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
                textAlign="center"
                size="large"
                extraClassNames="font-medium"
              />
            )}
          />

          <Button
            type="secondary"
            title={t(
              isOperationTypeAdd
                ? "maxButton"
                : "commitment.useAllCommittedBalance"
            )}
            size="small"
            extraClassNames="mt-2"
            wide
            pressableProps={{ onPress: setMaxAvailableBalance }}
          />
        </View>
      </Card>

      <Card>
        <Text color="muted" className="text-center" fullWidth>
          {t("transfer.pressTheButtonLonger")}
        </Text>

        <Button
          icon={<Ionicons name="send" size={24} color={iconColor.blackout} />}
          type="blackout"
          size="large"
          title={t("transfer.confirmTransaction")}
          pressableProps={{
            delayLongPress: 2000,
            onLongPress: onSubmit,
          }}
          fullWidth
        />
      </Card>
    </Fragment>
  );
};
