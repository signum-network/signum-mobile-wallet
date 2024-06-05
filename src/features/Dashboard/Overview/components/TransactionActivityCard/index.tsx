import { useMemo } from "react";
import { View, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Transaction, TransactionType } from "@signumjs/core";
import { ChainTime } from "@signumjs/util";
import { useAccount } from "@/hooks/useAccount";
import { useDateLocale } from "@/hooks/useDateLocale";
import { useAppTheme } from "@/hooks/useAppTheme";
import { formatDistanceToNow } from "date-fns";
import { Text } from "@/components/Text";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { openTransactionLink } from "@/utils/explorer/openLink";
import { transactionTypeReader } from "./utils/transactionTypeReader";
import { SummaryLabel } from "./components/SummaryLabel";

import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";

export const ITEM_HEIGHT = 100;

export const TransactionActivityCard = (props: Transaction) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { accountId } = useAccount();
  const dateLocale = useDateLocale();

  const {
    transaction,
    type,
    subtype,
    confirmations,
    timestamp,
    sender,
    recipient,
    attachment,
  } = props;

  const transactionReadableType = transactionTypeReader(type, subtype);

  const isPending = !confirmations || confirmations < 2;
  const timestampToDate = ChainTime.fromChainTimestamp(timestamp).getDate();
  const transactionDate = formatDistanceToNow(timestampToDate, {
    addSuffix: true,
    locale: dateLocale,
  });

  const hasPublicText = !!(attachment?.message && attachment?.messageIsText);
  const hasEncryptedText = !!(
    attachment?.encryptedMessage &&
    attachment?.encryptedMessage?.data &&
    attachment?.encryptedMessage?.isText
  );

  const hasAttachment = hasPublicText || hasEncryptedText;

  const transactionReadableData = useMemo(() => {
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

      switch (transactionReadableType) {
        case "Ordinary":
        case "MultiOut":
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

        case "AssetIssuance":
          return {
            title: t("overview.activityTransactions.AssetIssuance"),
          };

        case "AskOrderPlacement":
          return {
            title: t("overview.activityTransactions.AskOrderPlacement"),
            description: t(
              "overview.activityTransactions.AskOrderPlacementDescription"
            ),
          };

        case "BidOrderPlacement":
          return {
            title: t("overview.activityTransactions.BidOrderPlacement"),
            description: t(
              "overview.activityTransactions.BidOrderPlacementDescription"
            ),
          };

        case "AskOrderCancellation":
          return {
            title: t("overview.activityTransactions.AskOrderCancellation"),
            description: t(
              "overview.activityTransactions.AskOrderCancellationDescription"
            ),
          };

        case "BidOrderCancellation":
          return {
            title: t("overview.activityTransactions.BidOrderCancellation"),
            description: t(
              "overview.activityTransactions.BidOrderCancellationDescription"
            ),
          };

        case "AssetMint":
          return {
            title: t("overview.activityTransactions.AssetMint"),
          };

        case "AssetAddTreasureyAccount":
          return {
            title: t("overview.activityTransactions.AssetAddTreasureyAccount"),
            description: t(
              "overview.activityTransactions.AssetAddTreasureyAccountDescription",
              { account: readableRecipient }
            ),
          };

        case "AssetDistributeToHolders":
          return {
            title: getDefaultTitle(),
            description: t(
              isSender
                ? "overview.activityTransactions.AssetDistributeToHoldersDescription"
                : "overview.activityTransactions.FromAssetDistributeToHoldersDescription"
            ),
          };

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

        case "AddCommitment":
          return {
            title: t("overview.activityTransactions.AddCommitment"),
          };

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
          <Feather
            name="hard-drive"
            size={28}
            className="opacity-50"
            color={iconColor.default}
          />
        </View>
      ) : transactionReadableType === "SmartContractCreation" ? (
        <View>
          <Feather
            name="cpu"
            size={28}
            className="opacity-50"
            color={iconColor.default}
          />
        </View>
      ) : transactionReadableType === "Message" ? (
        <View>
          <Feather
            name="message-circle"
            size={28}
            className="opacity-50"
            color={iconColor.default}
          />
        </View>
      ) : isNeutral ? (
        <View>
          <Feather
            name="box"
            size={28}
            className="opacity-50"
            color={iconColor.default}
          />
        </View>
      ) : isSender ? (
        <View style={{ transform: [{ rotate: "-135deg" }] }}>
          <Feather name="arrow-down-circle" size={28} color="#EF4444" />
        </View>
      ) : (
        <View style={{ transform: [{ rotate: "45deg" }] }}>
          <Feather name="arrow-down-circle" size={28} color="#22C55E" />
        </View>
      );

    let memo = "";

    if (hasPublicText) {
      memo = attachment.message;
    }

    return {
      icon,
      isNeutral,
      title: getReadableMetadata().title,
      description: getReadableMetadata().description,
      isRecipient,
      isSender,
      showAttachmentBadge: !!(
        hasAttachment && transactionReadableType !== "Message"
      ),
      memo,
      hasPublicText,
      hasEncryptedText,
      isInvalid: getReadableMetadata()?.invalid,
    };
  }, [
    accountId,
    transaction,
    transactionReadableType,
    sender,
    recipient,
    attachment,
    iconColor,
  ]);

  const pickOptions = () => {
    const defaultOptions = [
      {
        text: t("overview.copyTransactionId"),
        onPress: async () => {
          await Clipboard.setStringAsync(transaction).then(() =>
            alert(t("overview.copiedTransactionId"))
          );
        },
      },
      {
        text: t("overview.viewTransactionInExplorer"),
        onPress: () => {
          openTransactionLink(transaction);
        },
      },
    ];

    if (transactionReadableData.hasPublicText) {
      defaultOptions[2] = {
        text: t("overview.viewMessage"),
        onPress: () => {
          Alert.alert(t("message"), transactionReadableData.memo);
        },
      };
    }

    Alert.alert(
      t("overview.options"),
      t("overview.description"),
      [...defaultOptions],
      {
        cancelable: true,
      }
    );
  };

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
      className={`w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered ${
        isPending && "opacity-80"
      }`}
    >
      <View className="flex flex-row items-center justify-start gap-2 flex-1 w-7/12">
        {transactionReadableData.icon}

        <View className="flex-1 flex flex-col">
          <View className="flex flex-row items-center gap-1">
            <Text className="font-medium">{transactionReadableData.title}</Text>

            {transactionReadableData.hasEncryptedText ? (
              <Text size="extraSmall" color="success">
                🔒 {t("overview.hasEncryptedMessage")}
              </Text>
            ) : (
              transactionReadableData.showAttachmentBadge && (
                <Text size="extraSmall" color="muted">
                  💬 {t("overview.hasMessage")}
                </Text>
              )
            )}
          </View>

          {transactionReadableData.description && (
            <Text size="extraSmall" color="muted">
              {transactionReadableData.description}
            </Text>
          )}

          <Text size="extraSmall" color="muted">
            {transactionDate}
          </Text>

          {isPending && (
            <Text size="extraSmall" color="muted">
              🕙 {t("overview.inProgress")}
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-5/12">
        <SummaryLabel
          {...props}
          transactionReadableType={transactionReadableType}
          isNeutral={transactionReadableData.isNeutral}
          isSender={transactionReadableData.isSender}
        />
      </View>
    </Pressable>
  );
};
