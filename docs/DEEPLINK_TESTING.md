# Deep Link Testing Guide

## Overview

The Signum Mobile Wallet supports deep linking for signing external transactions using the SRC-22 standard. This allows dApps and external applications to request transaction signatures from the wallet.

## Deep Link Format

```
signum://v1?action=sign&payload=<base64_encoded_json>
```

### Payload Structure

The payload is a base64-encoded JSON object with the following structure:

```json
{
  "unsignedTransactionBytes": "0110848400d0000000..."
}
```

### Example Deep Link

```
signum://v1?action=sign&payload=eyJ1bnNpZ25lZFRyYW5zYWN0aW9uQnl0ZXMiOiIwMTEwODQ4NDAwZDAwMDAwMDAuLi4ifQ==
```

## How It Works

1. **Deep Link Received**: App receives `signum://v1?action=sign&payload=...`
2. **Parse Payload**: Extracts and decodes base64 payload using SignumJS SRC-22 parser
3. **Parse Transaction**: Sends unsigned transaction bytes to node API (`parseTransaction`)
4. **Display Preview**: Shows transaction details (recipient, amount, fee, memo)
5. **User Confirmation**: User must long-press (2 seconds) to confirm
6. **Sign & Broadcast**: Signs with private key and broadcasts to network
7. **Show Result**: Displays transaction ID with copy and explorer links

## Security Features

- ✅ Full transaction preview before signing
- ✅ Long-press confirmation (2 seconds) prevents accidental signing
- ✅ Watch-only accounts cannot sign
- ✅ Node validation (balance, network, signature status)
- ✅ All cryptographic operations handled by SignumJS

## Testing Deep Links

### Prerequisites

- Wallet app running on iOS Simulator or Android Emulator/Device
- Node.js installed for testing script
- Test account with Testnet SIGNA

### Method 1: Using Test Script (Recommended)

The repo includes a test script that generates valid deep links with test data:

```bash
# From project root
node scripts/test-deeplink.js
```

The script will:
1. Ask you to select a transaction scenario
2. Generate unsigned transaction bytes
3. Create a proper SRC-22 deep link
4. Automatically open it in the app

**Available Scenarios:**
- Send Single Amount (basic transfer)
- Send Multi-Out (multiple recipients)
- Send Message (plain text message)
- Send Tokens (asset transfer)
- Send Encrypted Message (encrypted message)
- Publish Contract by Reference (smart contract deployment)

### Method 2: Manual Testing with `uri-scheme`

```bash
# iOS Simulator
npx uri-scheme open "signum://v1?action=sign&payload=YOUR_BASE64_PAYLOAD" --ios

# Android Emulator/Device
npx uri-scheme open "signum://v1?action=sign&payload=YOUR_BASE64_PAYLOAD" --android
```

### Method 3: Using ADB (Android Only)

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "signum://v1?action=sign&payload=YOUR_BASE64_PAYLOAD" \
  com.signum.mobile.wallet
```

### Method 4: Using xcrun simctl (iOS Simulator Only)

```bash
xcrun simctl openurl booted "signum://v1?action=sign&payload=YOUR_BASE64_PAYLOAD"
```

## Creating Custom Test Payloads

### Using SignumJS

```javascript
import { LedgerClientFactory } from '@signumjs/core';
import { src22 } from '@signumjs/standards';

// 1. Create unsigned transaction
const ledger = LedgerClientFactory.createClient({
  nodeHost: 'https://europe3.testnet.signum.network'
});

const unsignedTransaction = await ledger.transaction.sendAmount({
  recipientId: 'TS-QAJA-QW5Y-SWVP-4RVP4',
  amountPlanck: '100000000',
  feePlanck: '1000000',
  publicKey: 'YOUR_PUBLIC_KEY'
});

// 2. Create deep link
const deeplink = src22.createDeeplink({
  domain: 'signum',
  version: 'v1',
  action: 'sign',
  payload: {
    unsignedTransactionBytes: unsignedTransaction.unsignedTransactionBytes
  }
});

console.log(deeplink);
// Output: signum://v1?action=sign&payload=...
```

### Manual Payload Creation

```javascript
// 1. Create payload object
const payload = {
  unsignedTransactionBytes: "YOUR_UNSIGNED_TX_BYTES"
};

// 2. Encode to base64
const base64Payload = btoa(JSON.stringify(payload));

// 3. Construct deep link
const deeplink = `signum://v1?action=sign&payload=${base64Payload}`;
```

## Transaction Types Supported

### 1. Send Single Amount
Basic SIGNA transfer to a single recipient.

### 2. Send Multi-Out
Transfer SIGNA to multiple recipients in one transaction (currently only preview supported, signing may require additional implementation).

### 3. Send Message
Attach a plain text or binary message to a transaction.

### 4. Send Tokens (Assets)
Transfer tokens/assets on the Signum blockchain.

### 5. Send Encrypted Message
Send an encrypted message (requires recipient's public key).

### 6. Publish Contract by Reference
Deploy smart contracts using contract references (CIP templates).

## Troubleshooting

### Deep Link Not Opening App

**iOS:**
- Check that app is installed on the simulator
- Verify URL scheme is registered in `app.json`
- Try restarting the simulator

**Android:**
- Verify app package name matches in deep link command
- Check AndroidManifest.xml for intent-filter configuration
- Try: `adb shell dumpsys package com.signum.mobile.wallet | grep signum`

### Transaction Parsing Fails

- Verify transaction bytes are valid hex
- Ensure you're connected to the correct network (Testnet)
- Check that node API is accessible
- Verify base64 encoding is correct

### Signature Fails

- Check that account has sufficient balance
- Verify private keys are accessible in secure storage
- Ensure transaction deadline hasn't expired
- Check node connection

### Common Errors

**"Invalid transaction bytes"**: Base64 payload is malformed or transaction bytes are invalid

**"Ledger service not available"**: Node connection failed or not initialized

**"Unable to read secret keys"**: Account is not properly set up or is watch-only

**"Insufficient balance"**: Account doesn't have enough SIGNA for transaction + fees


### Key Components

- **DeepLinkInitializer**: Listens for deep links and routes to sign screen
- **SignScreen**: Main screen that handles parsing, preview, and signing
- **TransactionPreview**: Displays transaction details
- **SuccessSection**: Shows success state with transaction ID
- **ConfirmationSection**: Long-press button for signing

### API Endpoints Used

- `parseTransaction`: Node API endpoint to parse transaction bytes into JSON
- `signAndBroadcastTransaction`: SignumJS method to sign and broadcast

## Future Enhancements

- [ ] Support for callbacks (returning result to calling app)
- [ ] Support for multi-out transactions
- [ ] Better asset/token detection in preview
- [ ] Transaction simulation before signing
- [ ] QR code scanning for deep links
- [ ] Deep link analytics/logging

## References

- [SRC-22 Standard](https://github.com/signum-network/SIPs/blob/master/SIP/sip-22.md)
- [SignumJS Documentation](https://docs.signum.network/signum/)
- [Expo Deep Linking](https://docs.expo.dev/guides/deep-linking/)
