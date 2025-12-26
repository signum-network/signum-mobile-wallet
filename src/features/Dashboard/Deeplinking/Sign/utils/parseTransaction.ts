import type {Transaction} from "@signumjs/core";
import {
    getRecipientAmountsFromMultiOutPayment,
    TransactionArbitrarySubtype,
    TransactionAssetSubtype,
    TransactionMiningSubtype,
    TransactionPaymentSubtype,
    TransactionAdvancedPaymentSubtype,
    TransactionSmartContractSubtype,
    TransactionType,
} from "@signumjs/core";
import {Amount} from "@signumjs/util";

const BURN_ADDRESS = "0";
const SIGNA_TOKEN_ID = "0";

export type ParsedTransactionExpense = {
    tokenAddress?: string;
    tokenId?: string;
    refHash?: string;
    tokenName?: string;
    tokenDecimals?: number;
    aliasName?: string;
    hash?: string;
    amount?: Amount;
    price?: string;
    quantity?: string;
    to: string;
};

export interface ParsedTransactionType {
    hasAmount: boolean;
    i18nKey: string;
    iconName: string;
}

export type ParsedTransaction = {
    txType: number;
    txSubtype: number;
    amount?: Amount;
    type: ParsedTransactionType;
    expenses: ParsedTransactionExpense[];
    fee: Amount;
    isSelf: boolean;
    isDistribution: boolean;
    transaction: Transaction;
};

function isDistribution(tx: Transaction): boolean {
    return (
        tx.type === TransactionType.Asset &&
        tx.subtype === TransactionAssetSubtype.AssetDistributeToHolders
    );
}

function isTransactionToSelf(tx: Transaction): boolean {
    if (
        tx.type === TransactionType.Payment &&
        tx.subtype !== TransactionPaymentSubtype.Ordinary
    ) {
        return false;
    }

    if (!tx.recipient) {
        return true;
    }

    return tx.recipient === tx.sender;
}

export function parseSignumTransaction(tx: Transaction): ParsedTransaction {
    const expenses = parseTransactionExpenses(tx);
    return {
        amount: calculateAmount(tx),
        expenses,
        fee: Amount.fromPlanck(tx.feeNQT),
        type: parseTransactionType(tx),
        isSelf: isTransactionToSelf(tx),
        isDistribution: isDistribution(tx),
        txType: tx.type,
        txSubtype: tx.subtype,
        transaction: tx,
    };
}

function calculateAmount(tx: Transaction): Amount {
    if (
        tx.type === TransactionType.Payment &&
        tx.subtype === TransactionPaymentSubtype.MultiOut
    ) {
        const amounts = getRecipientAmountsFromMultiOutPayment(tx);
        return amounts.reduce(
            (total, {amountNQT}) => total.add(Amount.fromPlanck(amountNQT)),
            Amount.Zero()
        );
    }
    return Amount.Zero();
}

// --- EXPENSES SECTION ---

function parseTransactionExpenses(tx: Transaction): ParsedTransactionExpense[] {
    switch (tx.type) {
        case TransactionType.Payment:
            return parsePaymentExpenses(tx);
        case TransactionType.AdvancedPayment:
            return parseAdvancedPaymentExpenses(tx);
        case TransactionType.Asset:
            return parseAssetExpenses(tx);
        case TransactionType.SmartContract:
            return parseContractExpenses(tx);
        case TransactionType.Arbitrary:
            return parseArbitraryExpenses(tx);
        case TransactionType.Mining:
            return parseMiningExpenses(tx);
        default:
            return [];
    }
}

function parseMiningExpenses(tx: Transaction): ParsedTransactionExpense[] {
    switch (tx.subtype) {
        case TransactionMiningSubtype.AddCommitment:
        case TransactionMiningSubtype.RemoveCommitment:
            return [
                {
                    to: tx.sender,
                    amount: Amount.fromPlanck(tx?.attachment.amountNQT || 0),
                },
            ];
        case TransactionMiningSubtype.RewardRecipientAssignment:
            return [
                {
                    to: tx.recipient!,
                    amount: Amount.Zero(),
                },
            ];
        default:
            return [];
    }
}

function parseContractExpenses(tx: Transaction): ParsedTransactionExpense[] {
    const amount = Amount.fromPlanck(tx?.amountNQT || 0);

    switch (tx.subtype) {
        case TransactionSmartContractSubtype.SmartContractCreation:
            return [
                {
                    to: "",
                    hash: tx.referencedTransactionFullHash || tx.senderPublicKey,
                    amount,
                },
            ];
        case TransactionSmartContractSubtype.SmartContractPayment:
        default:
            return [
                {
                    to: tx.recipient!,
                    amount,
                },
            ];
    }
}

function parseArbitraryExpenses(tx: Transaction): ParsedTransactionExpense[] {
    switch (tx.subtype) {
        case TransactionArbitrarySubtype.AliasAssignment:
            return [
                {
                    to: tx.sender,
                    aliasName: tx.attachment.alias,
                    amount: Amount.Zero(),
                },
            ];
        case TransactionArbitrarySubtype.AliasSale:
            return [
                {
                    to: tx.recipient || tx.sender,
                    aliasName: tx.attachment.alias || tx.attachment.uri,
                    amount: Amount.fromPlanck(tx.attachment.priceNQT),
                },
            ];
        case TransactionArbitrarySubtype.AliasBuy:
            return [
                {
                    to: tx.sender,
                    aliasName: tx.attachment.alias || tx.attachment.uri,
                    amount: Amount.fromPlanck(tx.amountNQT || 0),
                },
            ];
            case TransactionArbitrarySubtype.TopLevelDomainAssignment:
                return [
                    {
                        to: tx.sender,
                        amount: Amount.fromPlanck(tx.amountNQT || 0),
                    }
                ]
        case TransactionArbitrarySubtype.AccountInfo:
        case TransactionArbitrarySubtype.Message:
        default:
            return [
                {
                    to: tx.recipient || tx.sender,
                    amount: Amount.Zero(),
                },
            ];
    }
}

function parseAssetExpenses(tx: Transaction): ParsedTransactionExpense[] {
    switch (tx.subtype) {
        case TransactionAssetSubtype.AssetDistributeToHolders:
            const distExpenses: ParsedTransactionExpense[] = [
                {
                    to: "",
                    tokenId: tx.attachment.asset,
                    quantity: tx.attachment.quantityMinimumQNT,
                    amount: Amount.fromPlanck(tx.amountNQT || 0),
                },
            ];
            if (
                tx.attachment.assetToDistribute &&
                tx.attachment.assetToDistribute !== "0"
            ) {
                distExpenses.push({
                    to: "",
                    tokenId: tx.attachment.assetToDistribute,
                    quantity: tx.attachment.quantityQNT,
                });
            }
            return distExpenses;
        case TransactionAssetSubtype.AssetMultiTransfer:
            const multiExpenses: ParsedTransactionExpense[] = [];
            const amount = Amount.fromPlanck(tx.amountNQT || 0);
            if (amount.greaterOrEqual(Amount.Zero())) {
                multiExpenses.push({
                    to: tx.recipient!,
                    amount,
                    tokenId: SIGNA_TOKEN_ID,
                });
            }
            let index = 0;
            for (const tokenId of tx.attachment.assetIds) {
                multiExpenses.push({
                    to: tx.recipient!,
                    tokenId,
                    quantity: tx.attachment.quantitiesQNT[index],
                });
                ++index;
            }
            return multiExpenses;
        case TransactionAssetSubtype.AskOrderPlacement:
        case TransactionAssetSubtype.BidOrderPlacement:
            return [
                {
                    to: "",
                    tokenId: tx.attachment.asset,
                    quantity: tx.attachment.quantityQNT,
                    price: tx.attachment.priceNQT,
                },
            ];
        case TransactionAssetSubtype.AskOrderCancellation:
        case TransactionAssetSubtype.BidOrderCancellation:
            return [
                {
                    to: "",
                    tokenId: tx.attachment.asset,
                },
            ];
        case TransactionAssetSubtype.AssetIssuance:
            return [
                {
                    to: tx.sender,
                    tokenName: tx.attachment.name,
                    tokenDecimals: tx.attachment.decimals,
                    quantity: tx.attachment.quantityQNT,
                },
            ];
        case TransactionAssetSubtype.AssetMint:
            return [
                {
                    to: tx.sender,
                    tokenId: tx.attachment.asset,
                    quantity: tx.attachment.quantityQNT,
                },
            ];
        case TransactionAssetSubtype.AssetTransfer:
        default: {
            const multiExpenses: ParsedTransactionExpense[] = [];
            const amount = Amount.fromPlanck(tx.amountNQT || 0);
            if (amount.greaterOrEqual(Amount.Zero())) {
                multiExpenses.push({
                    to: tx.recipient!,
                    amount,
                    tokenId: SIGNA_TOKEN_ID,
                });
            }
            multiExpenses.push(
                {
                    to: tx.recipient || BURN_ADDRESS,
                    tokenId: tx.attachment?.asset,
                    quantity: tx.attachment?.quantityQNT,
                },
            )
            return multiExpenses;
        }
    }
}

function parsePaymentExpenses(tx: Transaction): ParsedTransactionExpense[] {
    switch (tx.subtype) {
        case TransactionPaymentSubtype.MultiOut:
        case TransactionPaymentSubtype.MultiOutSameAmount: {
            const recipientAmounts = getRecipientAmountsFromMultiOutPayment(tx);
            return recipientAmounts.map(({recipient, amountNQT}) => ({
                to: recipient,
                amount: Amount.fromPlanck(amountNQT),
            }));
        }
        default:
            return [
                {
                    to: tx.recipient || BURN_ADDRESS,
                    amount: Amount.fromPlanck(tx?.amountNQT || 0),
                },
            ];
    }
}

function parseAdvancedPaymentExpenses(
    tx: Transaction
): ParsedTransactionExpense[] {
    if (tx.subtype === TransactionAdvancedPaymentSubtype.SubscriptionCancel) {
        return [
            {
                to: tx.sender,
            },
        ];
    }
    return [
        {
            to: tx.recipient || BURN_ADDRESS,
            amount: Amount.fromPlanck(tx?.amountNQT || 0),
        },
    ];
}

// --- TYPE SECTION ---

function parseTransactionType(tx: Transaction): ParsedTransactionType {
    switch (tx.type) {
        case TransactionType.Payment:
            return parsePaymentSubType(tx);
        case TransactionType.AdvancedPayment:
            return parseAdvancedPaymentSubType(tx);
        case TransactionType.Asset:
            return parseAssetSubType(tx);
        case TransactionType.SmartContract:
            return parseATSubType(tx);
        case TransactionType.Arbitrary:
            return parseArbitrarySubType(tx);
        case TransactionType.Mining:
            return parseMiningSubType(tx);
        default:
            return {
                i18nKey: "transaction",
                iconName: "swap-horizontal",
                hasAmount: true,
            };
    }
}

function parsePaymentSubType(tx: Transaction): ParsedTransactionType {
    return tx.recipient === BURN_ADDRESS
        ? {
            i18nKey: "burn",
            iconName: "flame",
            hasAmount: true,
        }
        : {
            i18nKey: "transferTo",
            iconName: "swap-vertical-outline",
            hasAmount: true,
        };
}

function parseAdvancedPaymentSubType(tx: Transaction): ParsedTransactionType {
    switch (tx.subtype) {
        case TransactionAdvancedPaymentSubtype.SubscriptionCancel:
            return {
                i18nKey: "subscriptionCancellation",
                iconName: "close-circle",
                hasAmount: false,
            };
        case TransactionAdvancedPaymentSubtype.SubscriptionSubscribe:
            return {
                i18nKey: "subscriptionCreation",
                iconName: "time",
                hasAmount: true,
            };
        default:
            return {
                i18nKey: "transaction",
                iconName: "swap-horizontal",
                hasAmount: true,
            };
    }
}

function parseAssetSubType(tx: Transaction): ParsedTransactionType {
    switch (tx.subtype) {
        case TransactionAssetSubtype.AssetTransfer:
        case TransactionAssetSubtype.AssetMultiTransfer:
            return tx.recipient === BURN_ADDRESS
                ? {
                    i18nKey: "burn",
                    iconName: "flame",
                    hasAmount: true,
                }
                : {
                    i18nKey: "transferTo",
                    iconName: "arrow-forward",
                    hasAmount: true,
                };
        case TransactionAssetSubtype.AssetDistributeToHolders:
            return {
                i18nKey: "distribution",
                iconName: "git-network",
                hasAmount: true,
            };
        case TransactionAssetSubtype.AskOrderPlacement:
            return {
                i18nKey: "createSaleOrder",
                iconName: "cart",
                hasAmount: false,
            };
        case TransactionAssetSubtype.BidOrderPlacement:
            return {
                i18nKey: "createBuyOrder",
                iconName: "cart-outline",
                hasAmount: true,
            };
        case TransactionAssetSubtype.AskOrderCancellation:
            return {
                i18nKey: "cancelSaleOrder",
                iconName: "close-circle",
                hasAmount: false,
            };
        case TransactionAssetSubtype.BidOrderCancellation:
            return {
                i18nKey: "cancelBuyOrder",
                iconName: "close-circle-outline",
                hasAmount: false,
            };
        case TransactionAssetSubtype.AssetIssuance:
            return {
                i18nKey: "tokenIssuance",
                iconName: "create",
                hasAmount: false,
            };
        case TransactionAssetSubtype.AssetMint:
            return {
                i18nKey: "tokenMint",
                iconName: "add-circle",
                hasAmount: false,
            };
        case TransactionAssetSubtype.AssetAddTreasureyAccount:
            return {
                i18nKey: "addTreasuryAccount",
                iconName: "business",
                hasAmount: false,
            };
        case TransactionAssetSubtype.AssetTransferOwnership:
            return {
                i18nKey: "transferOwnership",
                iconName: "swap-horizontal",
                hasAmount: false,
            };
        default:
            return {
                i18nKey: "transaction",
                iconName: "swap-horizontal",
                hasAmount: true,
            };
    }
}

function parseATSubType(tx: Transaction): ParsedTransactionType {
    if (tx.subtype === TransactionSmartContractSubtype.SmartContractCreation) {
        return {
            i18nKey: "contractCreation",
            iconName: "code-slash",
            hasAmount: true,
        };
    }
    return {
        i18nKey: "transaction",
        iconName: "swap-horizontal",
        hasAmount: true,
    };
}

function parseMiningSubType(tx: Transaction): ParsedTransactionType {
    switch (tx.subtype) {
        case TransactionMiningSubtype.RemoveCommitment:
            return {
                i18nKey: "removeCommitment",
                iconName: "trending-down",
                hasAmount: false,
            };
        case TransactionMiningSubtype.AddCommitment:
            return {
                i18nKey: "addCommitment",
                iconName: "trending-up",
                hasAmount: true,
            };
        case TransactionMiningSubtype.RewardRecipientAssignment:
            return {
                i18nKey: "joinPool",
                iconName: "people",
                hasAmount: false,
            };
        default:
            return {
                i18nKey: "transaction",
                iconName: "swap-horizontal",
                hasAmount: true,
            };
    }
}

function parseArbitrarySubType(tx: Transaction): ParsedTransactionType {
    switch (tx.subtype) {
        case TransactionArbitrarySubtype.Message:
            return {
                i18nKey: "messageTo",
                iconName: "mail",
                hasAmount: false,
            };
        case TransactionArbitrarySubtype.AccountInfo:
            return {
                i18nKey: "updateAccountInfo",
                iconName: "information-circle",
                hasAmount: false,
            };
        case TransactionArbitrarySubtype.AliasAssignment:
            return {
                i18nKey: "aliasClaim",
                iconName: "globe-outline",
                hasAmount: false,
            };
        case TransactionArbitrarySubtype.AliasBuy:
            return {
                i18nKey: "aliasBuy",
                iconName: "globe-outline",
                hasAmount: true,
            };
        case TransactionArbitrarySubtype.AliasSale:
            return {
                i18nKey: "aliasSell",
                iconName: "globe-outline",
                hasAmount: true,
            };
        case TransactionArbitrarySubtype.TopLevelDomainAssignment:
            return {
                i18nKey: "tldAssignment",
                iconName: "planet-outline",
                hasAmount: true,
            };
        default:
            return {
                i18nKey: "transaction",
                iconName: "swap-horizontal",
                hasAmount: true,
            };
    }
}
