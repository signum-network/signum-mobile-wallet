import {
  getRecipientAmountsFromMultiOutPayment,
  Ledger,
  Transaction,
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionMiningSubtype,
  TransactionPaymentSubtype,
    TransactionAdvancedPaymentSubtype,
  TransactionSmartContractSubtype,
  TransactionType
} from '@signumjs/core';
import {Amount} from "@signumjs/util";

const BURN_ADDRESS = '0';
const SIGNA_TOKEN_ID = '0';


export type ParsedTransactionExpense = {
  tokenAddress?: string;
  tokenId?: string;
  refHash?: string;
  tokenName?: string;
  tokenDecimals?: string;
  aliasName?: string;
  hash?: string;
  amount?: Amount;
  price?: string; // special treatment for orders
  quantity?: string; // we do not know the decimals here
  to: string;
};

export interface ParsedTransactionType {
  hasAmount: boolean;
  i18nKey: string;
  textIcon: string;
}

export type ParsedTransaction = {
  txType: number;
  txSubtype: number;
  amount?: Amount;
  delegate?: string;
  type: ParsedTransactionType;
  contractAddress?: string;
  expenses: ParsedTransactionExpense[];
  fee: Amount;
  isSelf: boolean;
  isDistribution: boolean;
  jsonTx: object;
};

const throwInappropriateTransactionType = () => {
  throw new Error('Inappropriate Transaction Type');
};

async function isContractInteraction(signum: Ledger, recipientId: string): Promise<boolean> {
  try {
    await signum.contract.getContract(recipientId);
    return true;
  } catch (e) {
    return false;
  }
}

function isDistribution(tx: Transaction): boolean {
  return tx.type === TransactionType.Asset && tx.subtype === TransactionAssetSubtype.AssetDistributeToHolders;
}

function isTransactionToSelf(tx: Transaction): boolean {
  if (tx.type === TransactionType.Payment && tx.subtype !== TransactionPaymentSubtype.Ordinary) {
    return false;
  }

  if (!tx.recipient) {
    return true;
  }

  return tx.recipient === tx.sender;
}

async function eventuallyResolveTokenId(signum: Ledger, jsonTx: Transaction) {
  if (
    jsonTx.type === TransactionType.Asset &&
    (jsonTx.subtype === TransactionAssetSubtype.AssetAddTreasureyAccount ||
      jsonTx.subtype === TransactionAssetSubtype.AssetTransferOwnership)
  ) {
    try {
      const tx = await signum.service.query<Transaction>('getTransaction', {
        fullHash: jsonTx.referencedTransactionFullHash
      });
      return tx.type === TransactionType.Asset && tx.subtype === TransactionAssetSubtype.AssetIssuance
        ? tx.transaction
        : undefined;
    } catch (e: any) {
      return Promise.resolve(undefined);
    }
  }
  return Promise.resolve(undefined);
}

/*
 * {"type":0,"subtype":0,"timestamp":234874675,"deadline":1440,"senderPublicKey":"c213e4144ba84af94aae2458308fae1f0cb083870c8f3012eea58147f3b09d4a","recipient":"6502115112683865257","recipientRS":"TS-K37B-9V85-FB95-793HN","amountNQT":"100000000","feeNQT":"735000","sender":"2402520554221019656","senderRS":"TS-QAJA-QW5Y-SWVP-4RVP4","height":2147483647,"version":1,"ecBlockId":"9556561047696549169","ecBlockHeight":384189,"verify":false,"requestProcessingTime":0}
 */

export async function parseSignumTransaction(
  transaction: string,
  signum: Ledger
): Promise<ParsedTransaction> {
  const jsonTx = JSON.parse(transaction) as Transaction;
  const [contractInteraction, resolvedTokenId] = await Promise.all([
    isContractInteraction(signum, jsonTx.recipient || ''),
    eventuallyResolveTokenId(signum, jsonTx)
  ]);

  const expenses = parseTransactionExpenses(jsonTx, resolvedTokenId);
  return{
          amount: calculateAmount(jsonTx),
          expenses,
          fee: Amount.fromPlanck(jsonTx.feeNQT),
          contractAddress: contractInteraction ? jsonTx.recipient : undefined,
          type: parseTransactionType(jsonTx),
          isSelf: isTransactionToSelf(jsonTx),
          isDistribution: isDistribution(jsonTx),
          txType: jsonTx.type,
          txSubtype: jsonTx.subtype,
          jsonTx
      }
}

function calculateAmount(tx: Transaction): Amount {
  if (tx.type === TransactionType.Payment && tx.subtype === TransactionPaymentSubtype.MultiOut) {
    const amounts = getRecipientAmountsFromMultiOutPayment(tx);
    return amounts.reduce((total, {amountNQT}) => total.add(Amount.fromPlanck(amountNQT)), Amount.Zero());
  }
  return Amount.Zero()
}

// --- EXPENSES SECTION

function parseTransactionExpenses(tx: Transaction, resolvedTokenId?: string): ParsedTransactionExpense[] {
  switch (tx.type) {
    case TransactionType.Payment:
      return parsePaymentExpenses(tx);
    case TransactionType.AdvancedPayment:
      return parseAdvancedPaymentExpenses(tx);
    case TransactionType.Asset:
      return parseAssetExpenses(tx, resolvedTokenId);
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
          amount: Amount.fromPlanck(tx?.attachment.amountNQT || 0)
        }
      ];
    case TransactionMiningSubtype.RewardRecipientAssignment:
      return [
        {
          to: tx.recipient!,
          amount: Amount.Zero()
        }
      ];
  }
  return throwInappropriateTransactionType();
}

function parseContractExpenses(tx: Transaction): ParsedTransactionExpense[] {
  const amount = Amount.fromPlanck(tx?.amountNQT || 0);

  switch (tx.subtype) {
    case TransactionSmartContractSubtype.SmartContractCreation:
      return [
        {
          to: '',
          hash: tx.referencedTransactionFullHash || tx.senderPublicKey,
          amount
        }
      ];
    case TransactionSmartContractSubtype.SmartContractPayment:
    default:
      return [
        {
          to: tx.recipient!,
          amount
        }
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
          amount: Amount.Zero()
        }
      ];
    case TransactionArbitrarySubtype.AliasSale:
      return [
        {
          to: tx.recipient || tx.sender,
          aliasName: tx.attachment.alias || tx.attachment.uri,
          amount: Amount.fromPlanck(tx.attachment.priceNQT)
        }
      ];
    case TransactionArbitrarySubtype.AliasBuy:
      return [
        {
          to: tx.sender,
          aliasName: tx.attachment.alias || tx.attachment.uri,
          amount: Amount.fromPlanck(tx.amountNQT || 0)
        }
      ];
    case TransactionArbitrarySubtype.AccountInfo:
    case TransactionArbitrarySubtype.Message:
    default:
      return [
        {
          to: tx.recipient || tx.sender,
          amount: Amount.Zero()
        }
      ];
  }
}

function parseAssetExpenses(tx: Transaction, resolvedTokenId?: string): ParsedTransactionExpense[] {
  switch (tx.subtype) {
    case TransactionAssetSubtype.AssetDistributeToHolders:
      const distExpenses: ParsedTransactionExpense[] = [
        {
          to: '',
          tokenId: tx.attachment.asset,
          quantity: tx.attachment.quantityMinimumQNT,
          amount: Amount.fromPlanck(tx.amountNQT || 0)
        }
      ];
      if (tx.attachment.assetToDistribute && tx.attachment.assetToDistribute !== '0') {
        distExpenses.push({
          to: '',
          tokenId: tx.attachment.assetToDistribute,
          quantity: tx.attachment.quantityQNT
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
          tokenId: SIGNA_TOKEN_ID
        });
      }
      let index = 0;
      for (const tokenId of tx.attachment.assetIds) {
        multiExpenses.push({
          to: tx.recipient!,
          tokenId,
          quantity: tx.attachment.quantitiesQNT[index]
        });
        ++index;
      }
      return multiExpenses;
    case TransactionAssetSubtype.AskOrderPlacement:
    case TransactionAssetSubtype.BidOrderPlacement:
      return [
        {
          to: '',
          tokenId: tx.attachment.asset,
          quantity: tx.attachment.quantityQNT,
          price: tx.attachment.priceNQT // this requires special treatment
        }
      ];
    case TransactionAssetSubtype.AskOrderCancellation:
    case TransactionAssetSubtype.BidOrderCancellation:
      return [
        {
          to: '',
          tokenId: tx.attachment.asset
        }
      ];
    case TransactionAssetSubtype.AssetIssuance:
      return [
        {
          to: tx.sender, // self
          tokenName: tx.attachment.name,
          tokenDecimals: tx.attachment.decimals,
          quantity: tx.attachment.quantityQNT
        }
      ];
    case TransactionAssetSubtype.AssetMint:
      return [
        {
          to: tx.sender,
          tokenId: tx.attachment.asset,
          quantity: tx.attachment.quantityQNT
        }
      ];
    case TransactionAssetSubtype.AssetAddTreasureyAccount:
      return [
        {
          to: tx.sender,
          tokenId: resolvedTokenId
        }
      ];
    case TransactionAssetSubtype.AssetTransferOwnership:
      return [
        {
          to: tx.recipient || BURN_ADDRESS,
          tokenId: resolvedTokenId
        }
      ];
    case TransactionAssetSubtype.AssetTransfer:
    default:
      return [
        {
          to: tx.recipient || BURN_ADDRESS,
          tokenId: tx.attachment.asset,
          quantity: tx.attachment.quantityQNT
        }
      ];
  }
}

function parsePaymentExpenses(tx: Transaction): ParsedTransactionExpense[] {
  switch (tx.subtype) {
    case TransactionPaymentSubtype.MultiOut:
    case TransactionPaymentSubtype.MultiOutSameAmount: {
      const recipientAmounts = getRecipientAmountsFromMultiOutPayment(tx);
      return recipientAmounts.map(({ recipient, amountNQT }) => ({
        to: recipient,
        amount: Amount.fromPlanck(amountNQT)
      }));
    }
    default:
      return [
        {
          to: tx.recipient || BURN_ADDRESS,
          amount: Amount.fromPlanck(tx?.amountNQT || 0)
        }
      ];
  }
}

function parseAdvancedPaymentExpenses(tx: Transaction): ParsedTransactionExpense[] {
  if (tx.subtype === TransactionAdvancedPaymentSubtype.SubscriptionCancel) {
    return [
      {
        to: tx.sender // self
      }
    ];
  }
  return [
    {
      to: tx.recipient || BURN_ADDRESS,
      amount: Amount.fromPlanck(tx?.amountNQT || 0)
    }
  ];
}

// -- TYPE SECTION

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
        i18nKey: 'transaction',
        textIcon: '⚙',
        hasAmount: true
      };
  }
}

function parsePaymentSubType(tx: Transaction): ParsedTransactionType {
  return !tx.recipient
    ? {
        i18nKey: 'burn',
        textIcon: '🔥',
        hasAmount: true
      }
    : {
        i18nKey: 'transferTo',
        textIcon: '➡',
        hasAmount: true
      };
}

function parseAdvancedPaymentSubType(tx: Transaction): ParsedTransactionType {
  switch (tx.subtype) {
    case TransactionAdvancedPaymentSubtype.SubscriptionCancel:
      return {
        i18nKey: 'subscriptionCancellation',
        textIcon: '❌🕖',
        hasAmount: false
      };
    case TransactionAdvancedPaymentSubtype.SubscriptionSubscribe:
      return {
        i18nKey: 'subscriptionCreation',
        textIcon: '🕖✨',
        hasAmount: true
      };
  }

  return throwInappropriateTransactionType();
}

function parseAssetSubType(tx: Transaction): ParsedTransactionType {
  switch (tx.subtype) {
    case TransactionAssetSubtype.AssetTransfer:
    case TransactionAssetSubtype.AssetMultiTransfer:
      return !tx.recipient
        ? {
            i18nKey: 'burn',
            textIcon: '🔥',
            hasAmount: true
          }
        : {
            i18nKey: 'transferTo',
            textIcon: '➡',
            hasAmount: true
          };
    case TransactionAssetSubtype.AssetDistributeToHolders:
      return {
        i18nKey: 'distribution',
        textIcon: '🌦️',
        hasAmount: true
      };
    case TransactionAssetSubtype.AskOrderPlacement:
      return {
        i18nKey: 'createSaleOrder',
        textIcon: '💱',
        hasAmount: false
      };
    case TransactionAssetSubtype.BidOrderPlacement:
      return {
        i18nKey: 'createBuyOrder',
        textIcon: '💱',
        hasAmount: true
      };
    case TransactionAssetSubtype.AskOrderCancellation:
      return {
        i18nKey: 'cancelSaleOrder',
        textIcon: '💱❌',
        hasAmount: false
      };
    case TransactionAssetSubtype.BidOrderCancellation:
      return {
        i18nKey: 'cancelBuyOrder',
        textIcon: '💱❌',
        hasAmount: false
      };
    case TransactionAssetSubtype.AssetIssuance:
      return {
        i18nKey: 'tokenIssuance',
        textIcon: '🪙✨',
        hasAmount: false
      };
    case TransactionAssetSubtype.AssetMint:
      return {
        i18nKey: 'tokenMint',
        textIcon: '🌬️🪙',
        hasAmount: false
      };
    case TransactionAssetSubtype.AssetAddTreasureyAccount:
      return {
        i18nKey: 'addTreasuryAccount',
        textIcon: '🏦',
        hasAmount: false
      };
    case TransactionAssetSubtype.AssetTransferOwnership:
      return {
        i18nKey: 'transferOwnership',
        textIcon: '➡🪙',
        hasAmount: false
      };
  }
  return throwInappropriateTransactionType();
}

function parseATSubType(tx: Transaction): ParsedTransactionType {
  if (tx.subtype === TransactionSmartContractSubtype.SmartContractCreation) {
    return {
      i18nKey: 'contractCreation',
      textIcon: '🤖',
      hasAmount: true
    };
  }
  return throwInappropriateTransactionType();
}

function parseMiningSubType(tx: Transaction): ParsedTransactionType {
  switch (tx.subtype) {
    case TransactionMiningSubtype.RemoveCommitment:
      return {
        i18nKey: 'removeCommitment',
        textIcon: '⚒📉',
        hasAmount: false
      };
    case TransactionMiningSubtype.AddCommitment:
      return {
        i18nKey: 'addCommitment',
        textIcon: '⚒📈',
        hasAmount: true
      };
    case TransactionMiningSubtype.RewardRecipientAssignment:
      return {
        i18nKey: 'joinPool',
        textIcon: '⚒👪',
        hasAmount: false
      };
  }
  return throwInappropriateTransactionType();
}

function parseArbitrarySubType(tx: Transaction): ParsedTransactionType {
  switch (tx.subtype) {
    case TransactionArbitrarySubtype.Message:
      return {
        i18nKey: 'messageTo',
        textIcon: '✉',
        hasAmount: false
      };
    case TransactionArbitrarySubtype.AccountInfo:
      return {
        i18nKey: 'updateAccountInfo',
        textIcon: 'ℹ',
        hasAmount: false
      };
    case TransactionArbitrarySubtype.AliasAssignment:
      return {
        i18nKey: 'aliasCreation',
        textIcon: '👤',
        hasAmount: false
      };
    case TransactionArbitrarySubtype.AliasBuy:
      return {
        i18nKey: 'aliasBuy',
        textIcon: '👤',
        hasAmount: true
      };
    case TransactionArbitrarySubtype.AliasSale:
      return {
        i18nKey: 'aliasSell',
        textIcon: '👤',
        hasAmount: true
      };
    default:
      return throwInappropriateTransactionType();
  }
}
