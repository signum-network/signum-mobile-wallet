import { useMemo } from "react";
import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { TransactionType } from "@signumjs/core";
import { useAccount } from "@/hooks/useAccount";
import { Text } from "@/components/Text";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { transactionTypeReader } from "./utils/transactionTypeReader";
import { AmountLabel } from "./components/AmountLabel";

import Feather from "@expo/vector-icons/Feather";

export const TransactionActivityCard = () => {
  const { t } = useTranslation();
  const { accountId } = useAccount();

  // TODO: Have the following options:
  // View transaction in block explorer
  // View message or memo
  // Copy Transaction ID
  const pickOptions = () => alert("Options clicked");

  const transaction = "0000";
  const type: number = 2;
  const subtype: number = 10;
  const confirmations = 2;
  const sender: string = "11224962117215913721";
  const recipient: string = "8629824288351884182";
  const attachment: any = {};

  const transactionReadableType = transactionTypeReader(type, subtype);

  const transactionReadableData = useMemo(() => {
    const isSender = sender === accountId;
    const isRecipient = recipient === accountId;

    const getReadableMetadata = () => {
      const getDefaultTitle = () =>
        t(isSender ? "overview.sent" : "overview.received");

      const getDefaultSource = () =>
        isSender
          ? t("overview.activityTransactions.OrdinaryTo", {
              account: isRecipient
                ? t("overview.activityTransactions.yourself")
                : asRSAddress(recipient),
            })
          : t("overview.activityTransactions.Ordinary", {
              account: asRSAddress(sender),
            });

      // TODO: Detect if user is on a watch-only account, is possible the message is encrypted

      switch (transactionReadableType) {
        case "Ordinary":
        // TODO: Show specific amount user got
        case "MultiOut":
        // TODO: Show specific amount user got
        case "MultiOutSameAmount":
        case "AssetTransfer":
        case "AssetMultiTransfer":
        case "SmartContractPayment":
          return {
            title: getDefaultTitle(),
            source: getDefaultSource(),
          };

        case "Message":
          return {
            title: `${getDefaultTitle()} ${t("message")}`,
            source: getDefaultSource(),
          };

        case "AliasAssignment":
          return {
            title: t("overview.activityTransactions.AliasAssignment"),
          };

        case "AccountInfo":
          return {
            title: t("overview.activityTransactions.AccountInfo"),
          };

        case "AliasSale":
          return {
            title: t(
              attachment?.priceNQT && attachment?.priceNQT == "0"
                ? "overview.activityTransactions.AliasTransfer"
                : "overview.activityTransactions.AliasSale"
            ),
            source: recipient
              ? t("overview.activityTransactions.OrdinaryTo", {
                  account: asRSAddress(recipient),
                })
              : t("overview.activityTransactions.AliasPublicSale"),
          };

        case "AliasBuy":
          return {
            title: t("overview.activityTransactions.AliasBuy"),
            source: t("overview.activityTransactions.Ordinary", {
              account: asRSAddress(recipient),
            }),
          };

        case "TopLevelDomainAssignment":
          return {
            title: t("overview.activityTransactions.TopLevelDomainAssignment"),
          };

        // TODO: Read Token metadata
        case "AssetIssuance":
          return {
            title: t("overview.activityTransactions.AssetIssuance"),
            source: attachment?.name ?? undefined,
          };

        // TODO: Read Token metadata
        case "AskOrderPlacement":
          return {
            title: t("overview.activityTransactions.AskOrderPlacement"),
            source: t(
              "overview.activityTransactions.AskOrderPlacementDescription"
            ),
          };

        // TODO: Read Token metadata
        case "BidOrderPlacement":
          return {
            title: t("overview.activityTransactions.BidOrderPlacement"),
            source: t(
              "overview.activityTransactions.BidOrderPlacementDescription"
            ),
          };

        // TODO: Read Token metadata
        case "AskOrderCancellation":
          return {
            title: t("overview.activityTransactions.AskOrderCancellation"),
            source: t(
              "overview.activityTransactions.AskOrderCancellationDescription"
            ),
          };

        // TODO: Read Token metadata
        case "BidOrderCancellation":
          return {
            title: t("overview.activityTransactions.BidOrderCancellation"),
            source: t(
              "overview.activityTransactions.BidOrderCancellationDescription"
            ),
          };

        // TODO: Read Token metadata
        case "AssetMint":
          return {
            title: t("overview.activityTransactions.AssetMint"),
          };

        // TODO: Read Token metadata
        case "AssetAddTreasureyAccount":
          return {
            title: t("overview.activityTransactions.AssetAddTreasureyAccount"),
            source: t(
              "overview.activityTransactions.AssetAddTreasureyAccountDescription",
              { account: asRSAddress(recipient) }
            ),
          };

        // TODO: Read Token metadata
        // TODO: Read appropiate metadata (SIGNA sent or/and Token sent)
        case "AssetDistributeToHolders":
          return {
            title: getDefaultTitle(),
            source: t(
              "overview.activityTransactions.AssetDistributeToHoldersDescription",
              { token: "NOTNOW" }
            ),
          };

        // TODO: Read Token metadata
        case "AssetTransferOwnership":
          return {
            title: t("overview.activityTransactions.AssetTransferOwnership"),
            source: t(
              "overview.activityTransactions.AssetTransferOwnershipDescription",
              { account: asRSAddress(recipient) }
            ),
          };

        case "RewardRecipientAssignment":
          return {
            title: t("overview.activityTransactions.RewardRecipientAssignment"),
            source: !!recipient && asRSAddress(recipient),
          };

        // TODO: Show SIGNA amount
        case "AddCommitment":
          return {
            title: t("overview.activityTransactions.AddCommitment"),
          };

        // TODO: Show SIGNA amount
        case "RemoveCommitment":
          return {
            title: t("overview.activityTransactions.RemoveCommitment"),
          };

        case "SubscriptionSubscribe":
          return {
            title: t("overview.activityTransactions.SubscriptionSubscribe"),
            source: t("overview.activityTransactions.OrdinaryTo", {
              account: asRSAddress(recipient),
            }),
          };

        case "SubscriptionCancel":
          return {
            title: t("overview.activityTransactions.SubscriptionCancel"),
          };

        case "SubscriptionCancel":
          return {
            title: t("overview.activityTransactions.SubscriptionCancel"),
          };

        case "SubscriptionPayment":
          return {
            title: `${t(
              isRecipient ? "overview.received" : "overview.sent"
            )} ${t("overview.activityTransactions.SubscriptionPayment")}`,
            source: getDefaultSource(),
          };

        case "SmartContractCreation":
          return {
            title: t("overview.activityTransactions.SmartContractCreation"),
          };

        default:
          return {
            title: "",
            source: "",
            invalid: true,
          };
      }
    };

    const isNeutral =
      !recipient ||
      transactionReadableType === "AliasAssignment" ||
      transactionReadableType === "AccountInfo" ||
      transactionReadableType === "AliasSale" ||
      transactionReadableType === "AliasBuy" ||
      transactionReadableType === "AssetIssuance" ||
      transactionReadableType === "AssetMint" ||
      transactionReadableType === "TopLevelDomainAssignment" ||
      transactionReadableType === "AssetAddTreasureyAccount" ||
      transactionReadableType === "AssetTransferOwnership" ||
      type === TransactionType.Mining ||
      transactionReadableType === "SubscriptionCancel" ||
      transactionReadableType === "SmartContractCreation";

    return {
      isNeutral,
      titleLabel: getReadableMetadata().title,
      sourceLabel: getReadableMetadata().source,
      dateLabel: "13 hours ago",
      memo: "",
      isRecipient,
      isSender,
      isPending: confirmations < 2,
      hasAttachment: false,
      isInvalid: getReadableMetadata()?.invalid,
    };
  }, [
    accountId,
    transaction,
    type,
    subtype,
    sender,
    recipient,
    attachment,
    confirmations,
    transactionReadableType,
  ]);

  if (transactionReadableData.isInvalid) {
    return (
      <View className="w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered">
        <Text size="small" color="muted">
          Unidentified Transaction | Type: {type} | Subtype: {subtype}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={pickOptions}
      className="w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered"
    >
      <View className="flex flex-row items-center justify-start gap-2 flex-1 w-8/12">
        {transactionReadableData.isNeutral ? (
          <View>
            <Feather name="box" size={28} className="opacity-50" />
          </View>
        ) : transactionReadableData.isRecipient ? (
          <View style={{ transform: [{ rotate: "45deg" }] }}>
            <Feather name="arrow-down-circle" size={28} color="#22C55E" />
          </View>
        ) : (
          <View style={{ transform: [{ rotate: "-135deg" }] }}>
            <Feather name="arrow-down-circle" size={28} color="#EF4444" />
          </View>
        )}

        <View className="flex-1 flex flex-col">
          <View className="flex flex-row items-center gap-1">
            <Text className="font-medium">
              {transactionReadableData.titleLabel}
            </Text>

            {!!(
              transactionReadableData.hasAttachment &&
              transactionReadableType !== "Message"
            ) && (
              <Text color="muted" className="text-xs">
                💬 {t("overview.hasMessage")}
              </Text>
            )}
          </View>

          {transactionReadableData.sourceLabel && (
            <Text size="small" color="muted">
              {transactionReadableData.sourceLabel}
            </Text>
          )}

          <Text size="small" color="muted">
            {transactionReadableData.dateLabel}
          </Text>

          {transactionReadableData.isPending && (
            <Text size="small" color="muted" className="text-xs">
              {t("overview.inProgress")}
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-4/12">
        <AmountLabel isRecipient isNeutral value="Token: NOTNOW" />
      </View>
    </Pressable>
  );
};
