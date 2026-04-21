# dApp Connection & Transaction Signing Flow

## Overview

The Signum Mobile Wallet supports deep link integration for dApps via the SRC-22 standard, enabling two core actions:

1. **`connect`** - Request user's public key for transaction creation (two-step approval flow)
2. **`sign`** - Sign and broadcast transactions (secured confirmation flow)

Both actions require explicit user approval and are protected by authentication guards.

> 💡 Check the [Demo dApp](../demo-dapp/index.html)


## Deep Link Protocol

All deep links use the `signum://` URL scheme and follow the SRC-22 standard format:

```
signum://v1?action=<action>&payload=<base64_encoded_json>
```

### Security & Validation

**Before Processing:**
- User must unlock the wallet (authentication required)
- Account must be synced with the network
- Network must match request (if specified)
- Watch-only accounts cannot sign or connect

**Protected Screen Guard:**
The wallet uses a `ProtectedScreen` wrapper that verifies:
- Account exists and is initialized
- User is authenticated
- Node is synchronized
- Account is properly secured on the current network

If any check fails, the user sees appropriate error cards instead of the deeplink action.

## Connect Action

The connect action allows a dApp to request the user's public key, which can then be used to generate unsigned transactions.

### Deep Link Format

```
signum://v1?action=connect&payload=<base64_encoded_json>
```

### Payload Structure

```json
{
  "appName": "My DApp",
  "callbackUrl": "https://mydapp.com/wallet-callback",
  "network": "mainnet" // optional: "mainnet" or "testnet"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `appName` | string | Name of the dApp requesting connection |
| `callbackUrl` | string | Valid HTTPS/HTTP URL to receive the public key |
| `network` | string | Optional. Must match wallet's current network |

### Example

```javascript
import { src22 } from '@signumjs/standards';

const deeplink = src22.createDeeplink({
  action: 'connect',
  payload: {
    appName: 'My DApp',
    callbackUrl: "https://mydapp.com/?action=connect",
    network: 'testnet' // optional
  }
});

// deeplink = "signum://v1?action=connect&payload=eyJhcHBOYW1lIjoiTXkg..."
window.location.href = deeplink;
```


### User Flow

1. **dApp creates deep link** with `action=connect`
2. **User taps link** → Wallet app opens
3. **Wallet shows approval screen:**
   - dApp name with favicon (or fallback icon)
   - Callback URL displayed
   - Network badge (if specified)
   - Security warning notice
   - Active account card showing balance and details
   - Account can be switched before approval
   - Approve/Reject buttons
4. **User approves** → Wallet redirects to callback URL with public key:
   ```
   https://mydapp.com/wallet-callback?publicKey=abc123...
   ```
5. **dApp stores public key** and can now generate unsigned transactions

### Callback Parameters

When successfully connected, the wallet will redirect to the callback URL with the following query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `publicKey` | string | User's public key (64 hex characters) |

> It's recommended to store this public key in the local or session storage, such that the connection status is available throughout the dApp's lifecycle.


### Error Handling

**"Missing app name in deep link payload"**
- Cause: `appName` field missing from payload
- Fix: Add `appName` to payload JSON

**"Missing callback URL in deep link payload"**
- Cause: `callbackUrl` field missing from payload
- Fix: Add `callbackUrl` to payload JSON

**"Network mismatch: wallet is on testnet, but dApp requested mainnet"**
- Cause: Wallet network doesn't match requested network
- Fix: Switch wallet to requested network, or update dApp to match user's network

**"No full accounts available. Only watch-only accounts found."**
- Cause: User only has watch-only accounts (cannot sign transactions)
- Fix: User needs to create or import a full account with mnemonic/private key

**"Invalid callback URL"**
- Cause: Callback URL is malformed or invalid
- Fix: Ensure callback URL is a valid HTTP/HTTPS URL

## Sign Action

The sign action allows a dApp to request signing and broadcasting of a pre-built unsigned transaction.

### Deep Link Format

```
signum://v1?action=sign&payload=<base64_encoded_json>
```

### Payload Structure

```json5
{
   "unsignedTransactionBytes": "001046...", 
   "network": "testnet" // optional: "mainnet" or "testnet"
   "callbackUrl": ""
}
```

### Required Fields

| Field                      | Type | Description                                      |
|----------------------------|------|--------------------------------------------------|
| `unsignedTransactionBytes` | string | Unsigned transaction in hex format               |
| `network`                  | string | Optional. Must match wallet's current network    |
| `callbackUrl`              | string | The dApps callback url to provide signing status |

### Example

```javascript
import { src22 } from '@signumjs/standards';
import { LedgerClientFactory } from '@signumjs/core';

// Step 1: Create unsigned transaction
const ledger = LedgerClientFactory.createClient({
  nodeHost: 'https://testnet.signum.network'
});

const unsigned = await ledger.transaction.sendAmountToSingleRecipient({
  recipientId: 'S-XXXX-XXXX-XXXX-XXXXX',
  amountPlanck: '100000000', // 1 SIGNA
  feePlanck: '1000000',
  senderPublicKey: storedPublicKey // from connect flow
});

// Step 2: Create sign deep link
const signLink = src22.createDeeplink({
  action: 'sign',
  payload: {
      unsignedTransactionBytes: unsigned.unsignedTransactionBytes, 
      network: 'testnet', 
      callbackUrl: "https://mydapp.com?action=sign"
  }
});

window.location.href = signLink;
```

### User Flow

1. **dApp creates unsigned transaction** using stored public key
2. **dApp creates sign deep link** with transaction bytes
3. **User taps link** → Wallet app opens
4. **Wallet parses and displays transaction preview:**
   - Shows transaction type (Payment, Token Transfer, Order, etc.)
   - Displays recipient(s) with account details
   - Shows amounts, tokens, or other transaction-specific details
   - Displays transaction fee
   - Shows total cost
   - Embedded messages (if present) with hex validation and formatting
   - Toggle between "parsed" (human-readable) and "json" (raw data) views
5. **User confirms with long-press** (2-second hold for security)
6. **Wallet signs and broadcasts** transaction
7. **Success screen shows:**
   - Transaction ID
   - Copy button
   - Explorer link button
   - Auto-redirects to dashboard after 5 seconds


### Callback Parameters

When successfully connected, the wallet will redirect to the callback URL with the following query parameters:

| Parameter       | Type                          | Description                                         |
|-----------------|-------------------------------|-----------------------------------------------------|
| `status`        | `success`,`failed`,`rejected` | Status of signing                                   |
| `transactionId` | string                        | Iff status is `success` a transactionId is provided |

> It's recommended to store this public key in the local or session storage, such that the connection status is available throughout the dApp's lifecycle.



### Supported Transaction Types

The wallet all Signum transactions, except for large contract (>8KiB) creation (which don't fit in a URL).
Following custom preview components for the following transaction types are supported (all others have a genenric signing screen):

| Transaction Type | Features Shown |
|------------------|----------------|
| **Payment** | Recipient(s), amounts, burn detection, multi-out support |
| **Token Transfer** | Token details, quantities, recipients |
| **Token Issuance** | Token name, symbol, decimals, supply, mintable flag |
| **Token Mint** | Token reference, additional supply amount |
| **Asset Order** | Order type (ask/bid/cancel), price, quantity |
| **Distribution** | Distribution list with percentages |
| **Treasury** | Treasury account additions |
| **Ownership Transfer** | New owner details |
| **Message** | Message content (text/binary), encryption status |
| **Account Info** | Name and description updates |
| **Alias** | Alias operations (claim, buy, sell) |
| **TLD Assignment** | Top-level domain assignments |
| **Commitment** | Add/remove mining commitments |
| **Pool** | Pool joining operations |
| **Smart Contract** | Contract creation details |
| **Subscription** | Subscription creation/cancellation |

### Transaction Preview Features

**Message Attachments:**
- Text messages display with character count
- Binary messages show as hex bytes (e.g., "48 65 6c 6c 6f" instead of "48656c6c6f")
- Hex validation with error indicator for invalid format
- Encrypted message indicator
- ScrollView for long messages (max height: 200px)
- JSON auto-detection and pretty-printing for structured data

**Recipient Display:**
- Account addresses with aliases (if available)
- Account descriptions
- Watch-only indicators
- Caps at 10 visible recipients (shows "+ X more" for longer lists)

**Amount Display:**
- Primary amounts in SIGNA with proper formatting
- Token quantities with token metadata
- Fee breakdown
- Total cost calculation

### Security Features

**Long-Press Confirmation:**
- User must hold "Confirm Transaction" button for 2 seconds
- Prevents accidental approvals
- Visual feedback during hold

**Transaction Validation:**
- Parses transaction bytes before display
- Shows detailed error if parsing fails
- Validates network match
- Checks account has sufficient balance (UI warning)

**Watch-Only Protection:**
- Watch-only accounts show error card
- Cannot proceed with signing
- Clear error message displayed

### Error Handling

**"Missing unsigned transaction bytes in deep link payload"**
- Cause: `unsignedTransactionBytes` field missing
- Fix: Add `unsignedTransactionBytes` to payload

**"Failed to parse transaction bytes"**
- Cause: Invalid or malformed transaction bytes
- Fix: Verify transaction was created correctly with matching network API

**"Network mismatch: wallet is on testnet, but transaction is for mainnet"**
- Cause: Transaction built for different network
- Fix: Rebuild transaction for correct network or switch wallet network

**"Cannot sign with watch-only account"**
- Cause: Active account is watch-only
- Fix: Switch to a full account (mnemonic or imported private key)

**"Transaction signing failed"**
- Cause: Various issues (insufficient balance, invalid parameters, network error)
- Fix: Check error details, verify account balance, retry

## Integration Example

### Complete Flow: Connect → Generate Transaction → Sign

#### Step 1: Request Connection

```javascript
// dApp frontend code
function connectWallet() {
  const deeplink = src22.createDeeplink({
    action: 'connect',
    payload: {
      appName: 'My DApp',
      callbackUrl: `${window.location.origin}/callback-connect`,
      network: 'testnet'
    }
  });

  window.location.href = deeplink;
}
```

#### Step 2: Handle Callback

```javascript
// Callback handler (client-side)
const urlParams = new URLSearchParams(window.location.search);
const publicKey = urlParams.get('publicKey');

if (publicKey) {
  // Store public key for session
  sessionStorage.setItem('connectedPublicKey', publicKey);

  // Redirect to app
  window.location.href = '/dashboard?connected=true';
}
```

#### Step 3: Create and Sign Transaction

```javascript
// Later, when user initiates a transaction
async function sendPayment(recipient, amount) {
  const publicKey = sessionStorage.getItem('connectedPublicKey');

  if (!publicKey) {
    // Not connected, redirect to connect
    connectWallet();
    return;
  }

  // Create unsigned transaction
  const ledger = LedgerClientFactory.createClient({
    nodeHost: 'https://testnet.signum.network'
  });

  const unsigned = await ledger.transaction.sendAmountToSingleRecipient({
    recipientId: recipient,
    amountPlanck: amount,
    feePlanck: '1000000',
    senderPublicKey: publicKey
  });

  // Create sign deep link
  const signLink = src22.createDeeplink({
    action: 'sign',
    payload: {
       unsignedTransactionBytes: unsigned.unsignedTransactionBytes, 
       callbackUrl: `${window.location.origin}/callback-sign`,
       network: 'testnet'
    }
  });

  window.location.href = signLink;
}
```

## Testing

### Manual Testing with Deep Links

#### Test Connect Flow

1. **Generate a connect deep link:**

```javascript
const payload = {
  appName: "Test DApp",
  callbackUrl: "https://example.com/callback",
  network: "testnet"
};

const base64Payload = btoa(JSON.stringify(payload));
const deeplink = `signum://v1?action=connect&payload=${base64Payload}`;

console.log(deeplink);
```

2. **Open in simulator/device:**

```bash
# iOS Simulator
npx uri-scheme open "signum://v1?action=connect&payload=..." --ios

# Android Emulator/Device
npx uri-scheme open "signum://v1?action=connect&payload=..." --android
```

3. **Expected behavior:**
   - Wallet opens to connection approval screen
   - Shows "Test DApp" name
   - Shows "example.com" callback URL
   - Shows current account with balance
   - Approve button is enabled (if account is full, not watch-only)
   - Reject button is enabled
   - Tapping Approve attempts to open callback URL (will fail for example.com, but confirms flow works)

#### Test Sign Flow

1. **Create an unsigned transaction** using SignumJS with a test account's public key

2. **Generate a sign deep link:**

```javascript
const payload = {
  unsignedTransactionBytes: "001046c0843d000....", // your unsigned tx bytes
  network: "testnet"
};

const base64Payload = btoa(JSON.stringify(payload));
const deeplink = `signum://v1?action=sign&payload=${base64Payload}`;

console.log(deeplink);
```

3. **Open in simulator/device:**

```bash
npx uri-scheme open "signum://v1?action=sign&payload=..." --ios
```

4. **Expected behavior:**
   - Wallet opens to transaction preview screen
   - Shows parsed transaction details (recipient, amount, fee, etc.)
   - Toggle between parsed and JSON views works
   - Long-press confirmation button is enabled
   - Holding button for 2 seconds proceeds to signing
   - Shows success screen with transaction ID
   - Auto-redirects to dashboard after 5 seconds

### Testing with Real dApp

For end-to-end testing, you can use a local web server:

```javascript
// Simple Express.js callback handler
app.get('/callback', (req, res) => {
  const { publicKey } = req.query;

  res.send(`
    <html>
      <body>
        <h1>Connected!</h1>
        <p>Public Key: ${publicKey}</p>
        <button onclick="testPayment()">Send Test Payment</button>
        <script>
          function testPayment() {
            // Use publicKey to create transaction
            // Then create sign deeplink
          }
        </script>
      </body>
    </html>
  `);
});
```

### Network Testing

Test both mainnet and testnet:

1. Set wallet to testnet
2. Try deeplink with `"network": "mainnet"` → Should show network mismatch error
3. Try deeplink with `"network": "testnet"` → Should succeed

### Watch-Only Account Testing

1. Create/import a watch-only account (public key only)
2. Try connect deeplink → Should show "No full accounts available" error
3. Try sign deeplink → Should show watch-only error card

### Error Scenario Testing

Test various error conditions:

- Missing `appName` in connect payload
- Missing `callbackUrl` in connect payload
- Invalid `callbackUrl` format
- Missing `unsignedTransactionBytes` in sign payload
- Malformed transaction bytes
- Network mismatch scenarios
- Locked wallet state (before authentication)

## Architecture Notes

### Deep Link Processing Flow

```
External App
    ↓ (creates deeplink URL)
Mobile OS
    ↓ (routes to Signum Wallet)
DeepLinkInitializer
    ↓ (parses URL with SRC-22)
    ↓ (validates payload)
pendingDeepLinkStore (Zustand)
    ↓ (stores pending deeplink data)
App Router
    ↓ (waits for isUnlocked)
    ↓ (routes to appropriate screen)
ProtectedScreen Guard
    ↓ (checks auth, sync, account)
Sign Screen / Connect Screen
    ↓ (shows preview/approval UI)
User Confirmation
    ↓ (approves/rejects)
Transaction Signing / Callback Redirect
```

### State Management

- **pendingDeepLinkStore:** Zustand store for pending deeplink data
  - Stores: `pathname`, `params` (extracted from payload)
  - Cleared after processing

- **Authentication:** Integrated with app unlock flow
  - Deeplinks wait for `isUnlocked` state
  - Routes only push when user authenticates

- **Network State:** Validated against current active node
  - Rejects if mismatch with requested network

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DeepLinkInitializer` | `src/providers/DataInitializer/` | Listens for and parses deeplinks |
| `ProtectedScreen` | `src/features/Dashboard/components/` | Auth guard wrapper |
| `SignScreen` | `src/features/Dashboard/Deeplinking/Sign/` | Transaction signing UI |
| `ConnectDAppScreen` | `src/features/Dashboard/Deeplinking/ConnectDApp/` | Connection approval UI |
| `TransactionPreviewSection` | `src/features/Dashboard/Deeplinking/Sign/sections/` | Routes to type-specific previews |
| `parseTransaction` | `src/features/Dashboard/Deeplinking/Sign/utils/` | Parses transaction bytes into readable format |

## Security Considerations

1. **No Automatic Key Sharing:** User must explicitly approve connection
2. **Watch-Only Exclusion:** Watch-only accounts cannot sign or connect
3. **Network Validation:** Prevents cross-network transaction signing
4. **Long-Press Confirmation:** Prevents accidental transaction approval
5. **Auth Guard:** All deeplink actions require app unlock
6. **Transaction Parsing:** Validates transaction format before display
7. **URL Validation:** Callback URLs must be valid before proceeding
8. **Secret Key Handling:** Keys read from secure storage only when needed, never stored in React state
9. **Error Messages:** Localized and user-friendly without exposing sensitive data

## Related Documentation

- [SRC-22 Standard](https://github.com/signum-network/SIPs/blob/master/SIP/sip-22.md)
- [SignumJS Documentation](https://docs.signum.network/signum/)
- [React Native Linking API](https://reactnative.dev/docs/linking)

## Troubleshooting

**Deeplink doesn't open the wallet:**
- Verify `signum://` scheme is registered in app.json/Info.plist
- Check if another app has claimed the scheme
- Try reinstalling the wallet app

**"Failed to parse deeplink" error:**
- Verify payload is valid JSON
- Check base64 encoding is correct
- Ensure required fields are present

**Callback URL not opening:**
- Verify URL is valid and accessible
- Check device has internet connection
- Test URL manually in browser

**Transaction keeps failing:**
- Verify account has sufficient balance
- Check network is correct (mainnet vs testnet)
- Verify transaction bytes are from same network as wallet
- Try creating transaction again with fresh data
