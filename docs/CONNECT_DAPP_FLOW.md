# dApp Connection Flow

## Overview

The Signum Mobile Wallet supports two deep link actions for dApp integration:

1. **`connect`** - Request user's public key and address (two-step flow)
2. **`sign`** - Sign a transaction (one-click flow or after connection)

## Connect Action

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

### Example

```javascript
import { src22 } from '@signumjs/standards';

const deeplink = src22.createDeeplink({
  domain: 'signum',
  version: 'v1',
  action: 'connect',
  payload: {
    appName: 'My DApp',
    callbackUrl: 'https://mydapp.com/wallet-callback',
    network: 'testnet' // optional
  }
});

// deeplink = "signum://v1?action=connect&payload=eyJhcHBOYW1lIjoiTXkg..."
window.location.href = deeplink;
```

## User Flow

1. **dApp creates deep link** with `action=connect`
2. **User taps link** → Wallet app opens
3. **Wallet shows approval screen:**
   - dApp name and URL
   - Permissions list
   - Account selector (user chooses which account to share)
   - Approve/Reject buttons
4. **User selects account and approves**
5. **Wallet redirects to callback URL:**
   ```
   https://mydapp.com/wallet-callback?publicKey=abc123&address=TS-QAJA...&accountId=123456
   ```
6. **dApp stores connection** and can now generate transactions

## Callback Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `publicKey` | string | User's public key (64 hex characters) |
| `address` | string | Reed-Solomon address (e.g., TS-QAJA-QW5Y-SWVP-4RVP4) |
| `accountId` | string | Numeric account ID |

## Security Features

- ✅ **User approval required** - No automatic sharing of keys
- ✅ **Single account selection** - User chooses which account to share
- ✅ **Watch-only accounts excluded** - Only full accounts can connect (can sign transactions)
- ✅ **Network validation** - Rejects if wallet is on different network
- ✅ **URL validation** - Callback URL must be valid HTTPS/HTTP URL

## Integration Example

### Step 1: Request Connection

```javascript
// dApp code
function connectWallet() {
  const sessionId = generateSessionId();
  sessionStorage.setItem('walletSession', sessionId);

  const deeplink = src22.createDeeplink({
    domain: 'signum',
    version: 'v1',
    action: 'connect',
    payload: {
      appName: 'My DApp',
      callbackUrl: `https://mydapp.com/callback?session=${sessionId}`,
      network: 'testnet'
    }
  });

  window.location.href = deeplink;
}
```

### Step 2: Handle Callback

```javascript
// Server-side or client-side callback handler
app.get('/callback', (req, res) => {
  const { publicKey, address, accountId, session } = req.query;

  // Store connection
  sessionStorage.setItem(`wallet_${session}`, JSON.stringify({
    publicKey,
    address,
    accountId,
    connectedAt: Date.now()
  }));

  // Redirect back to app
  res.redirect('/dashboard?connected=true');
});
```

### Step 3: Use Connection to Create Transactions

```javascript
// Later, when user wants to send a transaction
async function sendPayment(recipient, amount) {
  const session = sessionStorage.getItem('walletSession');
  const wallet = JSON.parse(sessionStorage.getItem(`wallet_${session}`));

  // Generate unsigned transaction using stored public key
  const ledger = LedgerClientFactory.createClient({
    nodeHost: 'https://testnet.signum.network'
  });

  const unsigned = await ledger.transaction.sendAmountToSingleRecipient({
    recipientId: recipient,
    amountPlanck: amount,
    feePlanck: '1000000',
    publicKey: wallet.publicKey // ← Use stored public key
  });

  // Create sign deep link
  const signLink = src22.createDeeplink({
    domain: 'signum',
    version: 'v1',
    action: 'sign',
    payload: {
      unsignedTransactionBytes: unsigned.unsignedTransactionBytes,
      callback: `https://mydapp.com/tx-result?session=${session}` // optional
    }
  });

  window.location.href = signLink;
}
```

## Testing

### Manual Testing

1. **Generate test deep link:**

```bash
node scripts/test-connect-deeplink.js
```

2. **Or create manually:**

```javascript
const payload = {
  appName: "Test DApp",
  callbackUrl: "https://example.com/callback",
  network: "testnet"
};

const base64Payload = btoa(JSON.stringify(payload));
const deeplink = `signum://v1?action=connect&payload=${base64Payload}`;

// Open in simulator
npx uri-scheme open "${deeplink}" --ios
// or
npx uri-scheme open "${deeplink}" --android
```

3. **Expected behavior:**
   - Wallet opens to connection approval screen
   - Shows "Test DApp" and "example.com"
   - Shows permissions list
   - Shows account selector
   - User can select account and approve
   - (Callback will fail since example.com is not real, but that's OK for testing)

### Automated Testing

See `scripts/test-connect-deeplink.js` for automated testing script.

## Error Handling

### Common Errors

**"Missing app name in deep link payload"**
- Cause: `appName` field missing from payload
- Fix: Add `appName` to payload

**"Missing callback URL in deep link payload"**
- Cause: `callbackUrl` field missing from payload
- Fix: Add `callbackUrl` to payload

**"Network mismatch: wallet is on testnet, but dApp requested mainnet"**
- Cause: Wallet is on different network than requested
- Fix: Switch wallet to requested network, or update dApp request

**"No full accounts available. Only watch-only accounts found."**
- Cause: User only has watch-only accounts (cannot sign transactions)
- Fix: User needs to create or import a full account

## Comparison with Sign-Only Flow

| Feature | Connect Flow | Sign-Only Flow |
|---------|-------------|----------------|
| **dApp gets public key** | ✅ Yes, via callback | ❌ No |
| **User approval** | ✅ Explicit approval screen | ⚠️ Implicit (by signing) |
| **dApp complexity** | Medium (need callback handler) | Low (just create deep link) |
| **Requires backend** | ⚠️ Yes (for web dApps) | ❌ No |
| **Multiple transactions** | ✅ Reuse public key | ⚠️ Need placeholder account |
| **Balance errors** | ✅ None | ⚠️ Possible (placeholder insufficient) |
| **Best for** | Full dApps with sessions | One-off payments, donations |

## Related Documentation

- [Sign Transaction Flow](./DEEPLINK_TESTING.md)
- [SRC-22 Standard](https://github.com/signum-network/SIPs/blob/master/SIP/sip-22.md)
- [SignumJS Documentation](https://docs.signum.network/signum/)
