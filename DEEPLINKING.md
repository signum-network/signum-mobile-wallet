# Deep Link Testing Script

## Quick Start

```bash
npm run test-deeplink
```

Or directly:

```bash
node scripts/test-deeplink.js
```

## What It Does

This interactive script:
1. ✅ Creates valid unsigned transactions using SignumJS
2. ✅ Generates proper SRC-22 deep links
3. ✅ Automatically opens them in your app via `uri-scheme`

## Requirements

- Node.js installed
- Wallet app running on iOS Simulator or Android Emulator/Device
- All dependencies installed (`npm install`)

## Available Test Scenarios

1. **Send Single Amount** - Basic SIGNA transfer
2. **Send Multi-Out** - Multiple recipients in one transaction
3. **Send Message** - Plain text message attachment
4. **Send Tokens** - Asset/token transfer
5. **Send Encrypted Message** - Encrypted message (requires recipient public key)

## Test Configuration

All test transactions use **Testnet** with fixed data:

- **Node**: `https://europe3.testnet.signum.network`
- **Test Recipient**: `TS-QAJA-QW5Y-SWVP-4RVP4`
- **Test Amount**: 1 SIGNA
- **Test Fee**: 0.01 SIGNA

## Example Session

```bash
$ npm run test-deeplink

🚀 Starting Deep Link Test Generator...

Configuration:
  Network: Testnet
  Node: https://europe3.testnet.signum.network
  Test Recipient: TS-QAJA-QW5Y-SWVP-4RVP4

=== Signum Mobile Wallet - Deep Link Test Generator ===

Select a transaction scenario:

  1. Send Single Amount
     Basic SIGNA transfer to a single recipient

  2. Send Multi-Out
     Transfer SIGNA to multiple recipients

  3. Send Message
     Send a plain text message

  4. Send Tokens
     Transfer tokens/assets

  5. Send Encrypted Message
     Send an encrypted message

  q. Quit

Enter your choice: 1

📝 Selected: Send Single Amount

Creating send amount transaction...
✅ Unsigned transaction created
   Transaction bytes: 0110848400d0000000...
✅ Deeplink generated

Select platform:

  1. iOS Simulator
  2. Android Emulator/Device
  3. Show deeplink only (manual testing)

Enter platform (1-3): 1

Opening deeplink on ios...
Deeplink: signum://v1?action=sign&payload=eyJ1bnNpZ25lZF...

Deeplink opened successfully!

Test another scenario? (y/n):
```

## Platform-Specific Testing

### iOS Simulator

The script will use:
```bash
npx uri-scheme open "signum://..." --ios
```

### Android Emulator/Device

The script will use:
```bash
npx uri-scheme open "signum://..." --android
```

### Manual Testing

Choose option 3 to get the deeplink without auto-opening, then use:

**iOS:**
```bash
xcrun simctl openurl booted "signum://..."
```

**Android:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "signum://..." com.signum.mobile.wallet
```

## Troubleshooting

### Script Fails to Open App

**Make sure:**
- App is installed and running on simulator/emulator
- You're using the correct platform option
- The `uri-scheme` package is available (comes with Expo)

**Alternative:** Choose option 3 for manual testing and use the commands above.

### Transaction Creation Fails

**Check:**
- Network connection
- Testnet node is accessible
- Transaction parameters are valid (especially for token transfers)

### Deep Link Opens But Nothing Happens

**Verify:**
- Deep link handler is initialized (`DeepLinkInitializer`)
- Sign screen route exists (`app/dashboard/sign/index.tsx`)
- Check app console logs for errors

## Customizing Test Data

Edit the `CONFIG` object in `test-deeplink.js`:

```javascript
const CONFIG = {
  nodeHost: 'https://europe3.testnet.signum.network',
  testSenderPublicKey: 'c213e4144ba84af94aae2458308fae1f0cb083870c8f3012eea58147f3b09d4a',
  testRecipient: 'TS-QAJA-QW5Y-SWVP-4RVP4',
  testAmount: '100000000', // 1 SIGNA in Planck
  testFee: '1000000',      // 0.01 SIGNA in Planck
  testMessage: 'Test message from deeplink script',
};
```

**Note:** Change only if you know what you're doing. Invalid values will cause transaction creation to fail.

## Adding New Scenarios

To add a new transaction type:

1. Create a handler function:
```javascript
async function createMyTransaction(ledger) {
  const unsignedTransaction = await ledger.transaction.myMethod({
    // transaction parameters
  });
  return unsignedTransaction.unsignedTransactionBytes;
}
```

2. Add to `SCENARIOS` object:
```javascript
const SCENARIOS = {
  // ... existing scenarios
  '6': {
    name: 'My New Transaction',
    description: 'Description of what it does',
    handler: createMyTransaction,
  },
};
```

## Related Documentation

- [Deep Link Testing Guide](../docs/DEEPLINK_TESTING.md) - Full documentation
- [SRC-22 Standard](https://github.com/signum-network/SIPs/blob/master/SIP/sip-22.md)
- [SignumJS Docs](https://docs.signum.network/signum/)
