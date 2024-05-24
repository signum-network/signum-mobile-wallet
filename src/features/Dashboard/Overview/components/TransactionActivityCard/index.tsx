import { useMemo } from "react";
import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Transaction, TransactionType } from "@signumjs/core";
import { ChainTime } from "@signumjs/util";
import { useAccount } from "@/hooks/useAccount";
import { useDateLocale } from "@/hooks/useDateLocale";
import { formatDistanceToNow } from "date-fns";
import { Text } from "@/components/Text";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { transactionTypeReader } from "../../sections/Activity/utils/transactionTypeReader";
import { SummaryLabel } from "./components/SummaryLabel";

import Feather from "@expo/vector-icons/Feather";

export const ITEM_HEIGHT = 100;

export const TransactionActivityCard = (props: Transaction) => {
  const { t } = useTranslation();
  const { accountId } = useAccount();
  const dateLocale = useDateLocale();

  const { transaction, type, subtype, confirmations, timestamp } = props;

  const transactionReadableType = transactionTypeReader(type, subtype);

  // TODO: Have the following options:
  // View transaction in block explorer
  // View message or memo
  // Copy Transaction ID
  const pickOptions = () => alert("Options clicked");

  const timestampToDate = ChainTime.fromChainTimestamp(timestamp).getDate();
  const transactionDate = formatDistanceToNow(timestampToDate, {
    addSuffix: true,
    locale: dateLocale,
  });

  const transactionReadableData = useMemo(() => {
    const { sender, recipient, attachment } = props;

    const isSender = sender === accountId;
    const isRecipient = !!(recipient && recipient === accountId);

    const readableRecipient: string = !!(recipient && recipient !== "0")
      ? `${asRSAddress(recipient)}`
      : t("burningAddress");

    const getReadableMetadata = () => {
      const getDefaultTitle = () =>
        t(isSender ? "overview.sent" : "overview.received");

      const getDefaultDescription = () =>
        isSender
          ? t("overview.activityTransactions.OrdinaryTo", {
              account: isRecipient ? t("overview.yourself") : readableRecipient,
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
            description: getDefaultDescription(),
          };

        case "Message":
          return {
            title: `${getDefaultTitle()} ${t("message")}`,
            description: getDefaultDescription(),
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
            description: recipient
              ? t("overview.activityTransactions.OrdinaryTo", {
                  account: readableRecipient,
                })
              : t("overview.activityTransactions.AliasPublicSale"),
          };

        case "AliasBuy":
          return {
            title: t("overview.activityTransactions.AliasBuy"),
            description: t("overview.activityTransactions.Ordinary", {
              account: readableRecipient,
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
            description: attachment?.name ?? undefined,
          };

        // TODO: Read Token metadata
        case "AskOrderPlacement":
          return {
            title: t("overview.activityTransactions.AskOrderPlacement"),
            description: t(
              "overview.activityTransactions.AskOrderPlacementDescription"
            ),
          };

        // TODO: Read Token metadata
        case "BidOrderPlacement":
          return {
            title: t("overview.activityTransactions.BidOrderPlacement"),
            description: t(
              "overview.activityTransactions.BidOrderPlacementDescription"
            ),
          };

        // TODO: Read Token metadata
        case "AskOrderCancellation":
          return {
            title: t("overview.activityTransactions.AskOrderCancellation"),
            description: t(
              "overview.activityTransactions.AskOrderCancellationDescription"
            ),
          };

        // TODO: Read Token metadata
        case "BidOrderCancellation":
          return {
            title: t("overview.activityTransactions.BidOrderCancellation"),
            description: t(
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
            description: t(
              "overview.activityTransactions.AssetAddTreasureyAccountDescription",
              { account: readableRecipient }
            ),
          };

        // TODO: Read Token metadata
        // TODO: Read appropiate metadata (SIGNA sent or/and Token sent)
        case "AssetDistributeToHolders":
          return {
            title: getDefaultTitle(),
            description: t(
              "overview.activityTransactions.AssetDistributeToHoldersDescription",
              { token: "NOTNOW" }
            ),
          };

        // TODO: Read Token metadata
        case "AssetTransferOwnership":
          return {
            title: t("overview.activityTransactions.AssetTransferOwnership"),
            description: t(
              "overview.activityTransactions.AssetTransferOwnershipDescription",
              { account: readableRecipient }
            ),
          };

        case "RewardRecipientAssignment":
          return {
            title: t("overview.activityTransactions.RewardRecipientAssignment"),
            description: !!recipient && readableRecipient,
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
            description: t("overview.activityTransactions.OrdinaryTo", {
              account: readableRecipient,
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
            description: getDefaultDescription(),
          };

        case "SmartContractCreation":
          return {
            title: t("overview.activityTransactions.SmartContractCreation"),
          };

        default:
          return {
            icon: <View></View>,
            title: "",
            description: "",
            invalid: true,
          };
      }
    };

    const isNeutral = !!(
      transactionReadableType === "AliasAssignment" ||
      transactionReadableType === "AccountInfo" ||
      transactionReadableType === "AliasSale" ||
      transactionReadableType === "AliasBuy" ||
      transactionReadableType === "AssetIssuance" ||
      transactionReadableType === "AskOrderPlacement" ||
      transactionReadableType === "BidOrderPlacement" ||
      transactionReadableType === "AskOrderCancellation" ||
      transactionReadableType === "BidOrderCancellation" ||
      transactionReadableType === "AssetMint" ||
      transactionReadableType === "AssetAddTreasureyAccount" ||
      transactionReadableType === "TopLevelDomainAssignment" ||
      transactionReadableType === "AssetTransferOwnership" ||
      type === TransactionType.Mining ||
      transactionReadableType === "SubscriptionCancel" ||
      transactionReadableType === "SmartContractCreation"
    );

    const icon =
      type === TransactionType.Mining ? (
        <View>
          <Feather name="cpu" size={28} className="opacity-50" />
        </View>
      ) : transactionReadableType === "Message" ? (
        <View>
          <Feather name="message-circle" size={28} className="opacity-50" />
        </View>
      ) : isNeutral ? (
        <View>
          <Feather name="box" size={28} className="opacity-50" />
        </View>
      ) : isRecipient ? (
        <View style={{ transform: [{ rotate: "45deg" }] }}>
          <Feather name="arrow-down-circle" size={28} color="#22C55E" />
        </View>
      ) : (
        <View style={{ transform: [{ rotate: "-135deg" }] }}>
          <Feather name="arrow-down-circle" size={28} color="#EF4444" />
        </View>
      );

    const hasAttachment =
      ((attachment?.message && attachment?.messageIsText) ||
        (attachment?.encryptedMessage && attachment?.encryptedMessage?.data)) &&
      transactionReadableType !== "Message";

    return {
      icon,
      isNeutral,
      title: getReadableMetadata().title,
      description: getReadableMetadata().description,
      memo: "",
      isRecipient,
      isSender,
      hasAttachment,
      isInvalid: getReadableMetadata()?.invalid,
    };
  }, [accountId, transaction, transactionReadableType]);

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
        {transactionReadableData.icon}

        <View className="flex-1 flex flex-col">
          <View className="flex flex-row items-center gap-1">
            <Text className="font-medium">{transactionReadableData.title}</Text>

            {transactionReadableData.hasAttachment && (
              <Text color="muted" className="text-xs">
                💬 {t("overview.hasMessage")}
              </Text>
            )}
          </View>

          {transactionReadableData.description && (
            <Text size="small" color="muted">
              {transactionReadableData.description}
            </Text>
          )}

          <Text size="small" color="muted">
            {transactionDate}
          </Text>

          {!!(confirmations && confirmations < 2) && (
            <Text size="small" color="muted" className="text-xs">
              {t("overview.inProgress")}
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-4/12">
        <SummaryLabel
          {...props}
          transactionReadableType={transactionReadableType}
          isNeutral={transactionReadableData.isNeutral}
          isRecipient={transactionReadableData.isRecipient}
        />
      </View>
    </Pressable>
  );
};
