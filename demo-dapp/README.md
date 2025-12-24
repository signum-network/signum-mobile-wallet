# Demo dApp - Signum Mobile Wallet Deep Link Testing

This is a simple demo web application to test the Signum Mobile Wallet deep link integration.

## Features

✅ **Connect Wallet** - Test the `connect` action (get user's public key)
✅ **Send Transaction** - Test the `sign` action (sign transactions)
✅ **Network Switching** - Test on both Testnet and Mainnet
✅ **Activity Log** - See all events and deep links generated
✅ **No Build Required** - Pure HTML/JavaScript using SignumJS CDN

## Quick Start

### Option 1: Vite Dev Server (Recommended ✅)

**Best for development - Hot reload, proper CORS, network access**

```bash
cd demo-dapp
npm install
npm run dev
```

Then open:
- **Local:** http://localhost:8000
- **Network:** http://YOUR_IP:8000 (shown in terminal)

Vite will automatically show your network IP addresses!

### Option 2: Simple HTTP Server (Python)

```bash
cd demo-dapp
npm run serve
# or
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 3: Simple HTTP Server (Node.js)

```bash
cd demo-dapp
npm run serve:node
# or
npx http-server -p 8000 -c-1
```

Then open: http://localhost:8000

## How to Test

### Testing on Mobile Device (Same WiFi)

1. **Start Vite dev server:**
   ```bash
   cd demo-dapp
   npm install
   npm run dev
   ```

2. **Vite will show your network addresses:**
   ```
   VITE v5.0.0  ready in 123 ms

   ➜  Local:   http://localhost:8000/
   ➜  Network: http://192.168.1.100:8000/  ← Use this on mobile!
   ```

3. **Open on mobile device:**
   - Open mobile browser (Safari/Chrome)
   - Navigate to the **Network** URL shown by Vite
   - Example: `http://192.168.1.100:8000`

4. **Test the flow:**
   - Click "Connect Wallet"
   - Wallet app opens
   - Approve connection
   - Returns to demo dApp
   - Click "Send Transaction"
   - Wallet opens to sign screen
   - Sign and broadcast
   - Returns to demo dApp with transaction ID

### Testing with Simulator/Emulator

1. **Start the server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Get localhost accessible URL:**
   - **iOS Simulator:** Use `http://localhost:8000`
   - **Android Emulator:** Use `http://10.0.2.2:8000`

3. **Open in simulator/emulator browser:**
   - Open Safari (iOS) or Chrome (Android)
   - Navigate to the URL
   - Test the flow as above

## Testing Scenarios

### Scenario 1: Connect + Send (Two-Step Flow)

1. ✅ Click "Connect Wallet"
2. ✅ Approve in wallet
3. ✅ See connected status
4. ✅ Enter recipient and amount
5. ✅ Click "Send Transaction"
6. ✅ Sign in wallet
7. ✅ See transaction ID

### Scenario 2: Network Mismatch

1. ✅ Select "Mainnet" in demo dApp
2. ✅ Click "Connect Wallet"
3. ✅ If wallet is on Testnet, should see error

### Scenario 3: No Accounts

1. ✅ Remove all full accounts from wallet (keep only watch-only)
2. ✅ Click "Connect Wallet"
3. ✅ Should see "No accounts available" error

### Scenario 4: Rejection

1. ✅ Click "Connect Wallet"
2. ✅ Click "Reject" in wallet
3. ✅ Returns to dApp without connection

## Callback URLs

The demo dApp uses query parameters for callbacks:

**Connect Callback:**
```
http://localhost:8000/?action=connected&publicKey=abc123&address=TS-QAJA...&accountId=123
```

**Sign Callback:**
```
http://localhost:8000/?action=signed&txId=123456&status=success
```

## Activity Log

The demo dApp shows a detailed activity log with:
- Timestamps
- Connection events
- Transaction creation
- Deep links generated
- Errors and successes

## Deep Link Preview

When you click buttons, the generated deep links are shown in the UI before opening them. You can:
- Copy the deep link
- Inspect the structure
- Manually open in wallet if needed

## Troubleshooting

### "Cannot connect to wallet"

- Make sure wallet app is installed
- Check that deep links are enabled
- Try opening deep link manually

### "Network mismatch"

- Wallet must be on same network (Testnet/Mainnet)
- Switch network in wallet settings

### "Transaction creation failed"

- Check that you're connected first
- Verify recipient address format
- Check amount is valid
- Ensure node is accessible

### "Callback not working"

- Check that server is accessible from mobile device
- Verify firewall settings
- Use IP address, not `localhost` on real device

## Files

- **`index.html`** - Single-file demo dApp (no build required)
- **`README.md`** - This file

## Dependencies

All dependencies loaded from CDN:
- `@signumjs/core` - Ledger API
- `@signumjs/standards` - SRC-22 deep link creation
- `@signumjs/http` - HTTP client

No npm install required!

## Advanced: HTTPS for Real Devices

For testing on real devices, you might need HTTPS (iOS Safari requires it for some features):

```bash
# Using mkcert (one-time setup)
brew install mkcert
mkcert -install
mkcert localhost 192.168.1.100

# Then use https-server
npm install -g http-server
http-server -S -C localhost+1.pem -K localhost+1-key.pem -p 8443
```

Then access: `https://192.168.1.100:8443`

## Notes

- This demo is NOT bundled into the mobile app
- It's a separate testing tool for developers
- Uses vanilla JavaScript (no frameworks)
- Works offline after initial load (CDN dependencies cached)
