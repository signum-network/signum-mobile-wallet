# GenericAccountCard

A reusable, highly customizable account card component with IPFS avatar/background support and visual status indicators.

## Features

- **IPFS Images**: Automatic loading of avatar and background images from IPFS
- **Render Props Pattern**: Fully customizable content via render props
- **Status Indicators**: Built-in badges for Contract, NFT, Watch-Only, and Unsecured accounts
- **Responsive Design**: Adapts text styling based on background presence
- **Proper Componentization**: All sub-components under 100 LoC
- **Loading States**: Graceful handling of image loading with fallback to hash icons

## Component Structure

```
GenericAccountCard/
├── GenericAccountCard.tsx      (87 LoC) - Main component
├── AccountAvatar.tsx           (51 LoC) - Avatar with loading states
├── BackgroundLayer.tsx         (63 LoC) - Background with overlay
├── StatusBadge.tsx            (26 LoC) - Individual badge
├── StatusIndicators.tsx        (78 LoC) - Badge container with logic
├── types.ts                    - TypeScript definitions
├── utils.ts                    - Helper functions
└── index.ts                    - Exports
```

## Usage

### Basic Example (Automatic Mode)

The component automatically parses images and creates status indicators from the `Account` object:

```tsx
import { GenericAccountCard } from "@/components/Account/GenericAccountCard";
import { Text } from "@/components/Text";

const MyComponent = () => {
  const account = {
    account: "123456789",
    accountRS: "S-ABCD-EFGH-IJKL-MNOP",
    description: "...",  // SRC-44 descriptor with avatar/background
    isAT: false,
    isSecured: true
  };

  return (
    <GenericAccountCard account={account} height={100}>
      {({ showBackground, account }) => (
        <Text color={showBackground ? "white" : "content"}>
          {account.accountRS}
        </Text>
      )}
    </GenericAccountCard>
  );
};
```

### Manual Override

You can override automatic behavior if needed:

```tsx
import { GenericAccountCard, type StatusIndicator } from "@/components/Account/GenericAccountCard";

const customStatusIndicators: StatusIndicator[] = [
  { type: "contract", label: "Smart Contract" },
  { type: "unsecured", label: "Not Secured" }
];

const customImages = {
  avatarUrl: "https://...",
  backgroundUrl: "https://..."
};

<GenericAccountCard
  account={account}
  statusIndicators={customStatusIndicators}  // Override auto-detection
  images={customImages}  // Override auto-parsing
>
  {({ showBackground }) => (
    // Your custom content
  )}
</GenericAccountCard>
```

### With Selection and Press Handler

```tsx
<GenericAccountCard
  account={account}
  isSelected={selectedId === account.account}
  onPress={() => handleSelect(account.account)}
>
  {({ showBackground, account }) => (
    // Your custom content
  )}
</GenericAccountCard>
```

### Watch-Only Accounts

```tsx
<GenericAccountCard
  account={account}
  watchOnly={true}  // Adds "Watch Only" badge
>
  {({ showBackground, account }) => (
    // Your custom content
  )}
</GenericAccountCard>
```

### Complete Example (ResolvingAccountCard)

Look how simple it is now - the component handles everything automatically!

```tsx
export const ResolvingAccountCard = () => {
  const { t } = useTranslation();
  const { account: resolvedAccount } = useQueryAccountResolver(recipient);
  const resolvedAccountName = resolvedAccount.aliasName ?? resolvedAccount?.name ?? "";

  // GenericAccountCard automatically:
  // - Parses IPFS images from description
  // - Creates status badges for isAT, isSecured, etc.
  // - Handles all loading states
  return (
    <GenericAccountCard account={resolvedAccount} height={100}>
      {({ showBackground, account }) => (
        <>
          {resolvedAccountName && (
            <Text
              color={showBackground ? "white" : "content"}
              className="font-bold"
            >
              {resolvedAccountName}
            </Text>
          )}
          <Text
            size="small"
            color={showBackground ? "white" : "muted"}
          >
            {account.accountRS}
          </Text>
          <Text
            size="extraSmall"
            color={showBackground ? "white" : "muted"}
          >
            {account.account}
          </Text>
        </>
      )}
    </GenericAccountCard>
  );
};
```

## Props

### GenericAccountCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `account` | `Account` | **required** | Account object from @signumjs/core |
| `watchOnly` | `boolean` | `false` | Show "Watch Only" badge |
| `height` | `number` | `100` | Card height in pixels |
| `statusIndicators` | `StatusIndicator[]` | Auto-generated | Override auto-generated status badges |
| `images` | `AccountImages \| null` | Auto-parsed | Override auto-parsed images from description |
| `children` | `(props: RenderPropsContext) => ReactNode` | `undefined` | Render props for custom content |
| `onPress` | `() => void` | `undefined` | Press handler (makes card pressable) |
| `isSelected` | `boolean` | `false` | Shows selection border |
| `className` | `string` | `""` | Additional CSS classes |

### Automatic Behavior

The component automatically:
- **Parses images**: Extracts avatar/background from `account.description` (SRC-44 descriptor)
- **Creates status indicators**: Based on `account.isAT`, `account.isSecured`, `watchOnly` prop
- **NFT detection**: Uses `isAccountSrc40Nft()` to show NFT badge instead of contract
- **Loading states**: Handles avatar and background image loading gracefully

### RenderPropsContext

The children render prop receives:

```ts
{
  showBackground: boolean;  // True if background image loaded
  account: Account;         // The full account object
}
```

### StatusIndicator Types

```ts
type StatusIndicatorType = "contract" | "nft" | "watchOnly" | "unsecured";

interface StatusIndicator {
  type: StatusIndicatorType;
  label: string;
}
```

## Utilities

### parseAccountImages

Parses SRC-44 descriptor from account description to extract IPFS URLs:

```ts
const images = parseAccountImages(account.description);
// Returns: { avatarUrl: string | null, backgroundUrl: string | null } | null
```

## Styling

The component automatically handles:
- Text shadows when background image is present
- Dark overlay on background for readability
- Border highlighting for selected state
- Responsive status badge colors based on background
- Smooth image loading transitions

## Best Practices

1. **Let it be automatic**: Just pass the `account` object - don't manually parse images or build indicators
2. **Override only when needed**: Use `images` and `statusIndicators` props only for special cases
3. **Conditional styling**: Use the `showBackground` prop to adjust text colors and styles
4. **Keep content focused**: Use render props for account-specific content only
5. **Access account in render props**: The full `account` object is available in the render props context

## Migrating from Manual Approach

### Before (Manual - Verbose)
```tsx
const images = useMemo(() => parseAccountImages(account.description), [account.description]);
const statusIndicators = useMemo(() => {
  const indicators = [];
  if (account.isAT) indicators.push({ type: "contract", label: t("contract") });
  if (!account.isSecured) indicators.push({ type: "unsecured", label: t("unsecured") });
  return indicators;
}, [account, t]);

<GenericAccountCard accountId={account.account} images={images} statusIndicators={statusIndicators}>
  {({ showBackground }) => ...}
</GenericAccountCard>
```

### After (Automatic - Simple)
```tsx
<GenericAccountCard account={account}>
  {({ showBackground, account }) => ...}
</GenericAccountCard>
```

Much cleaner! 🎉
