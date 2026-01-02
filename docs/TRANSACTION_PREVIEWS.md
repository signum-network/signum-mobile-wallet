# Transaction Preview System

## Overview

The Sign screen now supports two view modes for transaction previews:
1. **Parsed View** - User-friendly display of transaction details
2. **JSON View** - Raw transaction data for debugging/verification

## Architecture

### View Mode Toggle
`src/features/Dashboard/Sign/components/ViewModeToggle.tsx`
- Toggles between "parsed" and "json" views
- Styled using theme tokens for consistency

### JSON View
`src/features/Dashboard/Sign/components/JsonView.tsx`
- Displays raw transaction JSON
- Scrollable for large transactions
- Monospace font for readability

### Type-Specific Previews
Located in `src/features/Dashboard/Sign/components/previews/`

#### Currently Implemented:
- **PaymentPreview** - For ordinary payments, multi-out
- **GenericPreview** - Fallback for all other transaction types

## Transaction Type Support

### ✅ Fully Supported
- **Payment** (Type 0)
  - Ordinary (Subtype 0)
  - MultiOut (Subtype 1)
  - MultiOutSameAmount (Subtype 2)

Shows: Recipient, Amount (with market value), Fees (with market value), Message/Memo

### 📋 Generic Preview (All Others)
For unsupported transaction types, shows:
- Transaction type name
- Recipient (if present)
- Amount (if present)
- Fees
- Sender
- Raw attachment data

### 🔜 To Be Implemented

See `src/features/Dashboard/Sign/components/previews/README.md` for full list of transaction types needing specialized previews.

**Priority implementations:**
1. Asset Transfer
2. Message
3. Smart Contract Creation/Payment
4. Add/Remove Commitment
5. Asset Issuance

## Transaction Types Reference

### Main Types (8 total)
```typescript
enum TransactionType {
  Payment = 0,           // Basic payments
  Arbitrary = 1,         // Messages, aliases, polls, etc.
  Asset = 2,             // Token operations
  Marketplace = 3,       // Marketplace operations
  Leasing = 4,           // Balance leasing
  Mining = 20,           // Mining/commitment operations
  AdvancedPayment = 21,  // Escrow, subscriptions
  SmartContract = 22     // Smart contracts
}
```

### Subtypes
Each main type has multiple subtypes (48 total combinations):
- Payment: 3 subtypes
- Arbitrary: 9 subtypes
- Asset: 11 subtypes
- Marketplace: 8 subtypes
- Leasing: 1 subtype
- Mining: 3 subtypes
- AdvancedPayment: 6 subtypes
- SmartContract: 2 subtypes

See `src/features/Dashboard/Sign/utils/transactionTypes.ts` for complete definitions.

## Adding New Transaction Previews

### 1. Create Preview Component

Create a new file in `src/features/Dashboard/Sign/components/previews/`:

```tsx
// YourTransactionPreview.tsx
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";

interface Props {
  transaction: Transaction;
}

export const YourTransactionPreview = ({ transaction }: Props) => {
  const { t } = useTranslation();

  // Extract type-specific data from transaction.attachment
  const specificData = transaction.attachment?.yourField;

  return (
    <>
      {/* Render transaction-specific fields */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("Field Name")}
        </Text>
        <Text className="font-medium">{specificData}</Text>
      </View>

      {/* Always show fees */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("fees")}
        </Text>
        <Text className="font-medium">
          {`${Amount.fromPlanck(transaction.feeNQT).getSigna()} SIGNA`}
        </Text>
      </View>
    </>
  );
};
```

### 2. Register in TransactionPreview

Edit `src/features/Dashboard/Sign/sections/TransactionPreview.tsx`:

```tsx
import { YourTransactionPreview } from "../components/previews/YourTransactionPreview";
import {
  TransactionType,
  TransactionYourTypeSubtype,
} from "../utils/transactionTypes";

// In renderParsedView():
if (
  type === TransactionType.YourType &&
  subtype === TransactionYourTypeSubtype.YourSubtype
) {
  return <YourTransactionPreview transaction={transaction} />;
}
```

### 3. Test

Use the test script to generate a deep link for your transaction type:

```bash
npm run test-deeplink
```

## Common Patterns

### Displaying Amounts
```tsx
import { Amount } from "@signumjs/util";

const amountSigna = Number(Amount.fromPlanck(transaction.amountNQT).getSigna());
```

### Displaying Market Value
```tsx
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";

const { price, symbol } = useActiveMarketRate();
const marketValue = price ? amountSigna * price : 0;

{!!marketValue && (
  <Text size="small" color="muted">
    {`${symbol}${formatNumber({ value: marketValue, isFiat: true })}`}
  </Text>
)}
```

### Displaying Addresses
```tsx
<Card>
  <Text className="font-medium">{transaction.recipientRS}</Text>
  <Text size="small" color="muted">{transaction.recipient}</Text>
</Card>
```

### Reading Attachments
```tsx
// Each transaction type has different attachment structure
const attachment = transaction.attachment;

// Example for Asset Transfer:
// attachment.version.Asset
// attachment.asset
// attachment.quantityQNT

// Example for Message:
// attachment.version.Message
// attachment.message
// attachment.messageIsText
```

## Helper Function

Use `getTransactionTypeName()` to get human-readable type names:

```tsx
import { getTransactionTypeName } from "../utils/transactionTypes";

const typeName = getTransactionTypeName(
  transaction.type,
  transaction.subtype
);
// Returns: "Payment", "Asset Transfer", "Smart Contract Creation", etc.
```


## Testing

### Test Deep Links
```bash
npm run test-deeplink
```

Select a scenario, and the script will:
1. Create an unsigned transaction
2. Generate a proper deep link
3. Open it in your app

### View Modes
Toggle between "Parsed View" and "JSON View" to:
- Verify parsed data matches raw JSON
- Debug attachment structures
- Understand transaction format

## Future Enhancements

- [ ] Add all 48 transaction type/subtype combinations
- [ ] Asset/token preview with token metadata
- [ ] Multi-out recipient list display
- [ ] Smart contract code preview
- [ ] Transaction simulation/dry-run
- [ ] Warning indicators for high-risk operations
- [ ] Attachment file previews (for marketplace, etc.)

## References

- [Signum Transaction Types](https://github.com/signum-network/signumjs/blob/main/packages/core/src/constants/)
- [Signum API Documentation](https://docs.signum.network/signum-api/)
- [Preview Implementation Guide](../src/features/Dashboard/Sign/components/previews/README.md)
