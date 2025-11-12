import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { formatNumber } from "@/utils/formatNumber";
import type { CommitmentStatus } from "../types";
import { useTimeout } from "../hooks/useTimeout";

interface Props extends CommitmentStatus {
  isOperationTypeAdd: boolean;
  isOperationTypeRemove: boolean;
  committedBalance: number;
}

export const CommitmentStatusTracker = ({
  isOperationTypeAdd,
  isOperationTypeRemove,
  forgedBlockRecently,
  forgedBlockTimeFrame,
  isCommitmentBalanceUpdating,
  commitmentBalanceUpdateTimeFrame,
  committedBalance,
}: Props) => {
  const { t } = useTranslation();

  const forgedBlockTimeFrameLabel = useTimeout(forgedBlockTimeFrame);
  const addCommitmentTimeFrameLabel = useTimeout(
    commitmentBalanceUpdateTimeFrame
  );

  if (isCommitmentBalanceUpdating) {
    const timeFrame = `${addCommitmentTimeFrameLabel} (${formatNumber({
      value: commitmentBalanceUpdateTimeFrame,
    })} ${t("blocks")})`;

    return (
      <Card>
        <View className="gap-1 flex flex-row items-center justify-center">
          <ActivityIndicator />
          <Text className="font-medium">
            {t("commitment.updatingCommitmentTitle")}
          </Text>
        </View>

        <View className="flex flex-col gap-1 w-full">
          <Text color="muted">
            {t(
              isOperationTypeAdd
                ? "commitment.updatingCommitmentDescription"
                : "commitment.removeUpdatingCommitmentFeedbackDescription"
            )}
          </Text>

          <Text color="muted" className="font-bold">
            {timeFrame}
          </Text>
        </View>
      </Card>
    );
  }

  if (isOperationTypeRemove && forgedBlockRecently && !!committedBalance) {
    const timeFrame = `${forgedBlockTimeFrameLabel} (${formatNumber({
      value: forgedBlockTimeFrame,
    })} ${t("blocks")})`;

    return (
      <Card>
        <View className="gap-1 flex flex-row items-center justify-center">
          <ActivityIndicator />
          <Text className="font-medium">
            {t("commitment.removeCommitmentLockedForgedBlockTitle")}
          </Text>
        </View>

        <View className="flex flex-col gap-1 w-full">
          <Text color="muted">
            {t("commitment.removeCommitmentLockedForgedBlockDescription")}
          </Text>

          <Text color="muted" className="font-bold">
            {timeFrame}
          </Text>

          <Text color="muted">
            {t("commitment.removeCommitmentLockedForgedBlockSecondDescription")}
          </Text>
        </View>
      </Card>
    );
  }

  return null;
};
