import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import type { ParsedTransaction } from "../../utils/parseTransaction";
import {AccountDescriptor, TotalAmount} from "./components";

interface Props {
  parsed: ParsedTransaction;
}

export const PoolPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const expense = parsed.expenses[0];
  return (
    <>
      {/* Pool Address */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.poolRewardRecipient")}
        </Text>

          <AccountDescriptor accountId={expense.to} />
      </View>

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t("sign.poolAssignmentExplanation")}
        </Text>
      </Card>

      <TotalAmount fee={parsed.fee} total={parsed.fee} />

    </>
  );
};
