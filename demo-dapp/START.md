# Quick Start Guide

## 🚀 Running the Demo dApp

### 1. Install Dependencies (One Time)

```bash
cd demo-dapp
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

You'll see output like:

```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:8000/
➜  Network: http://192.168.1.100:8000/
➜  press h + enter to show help
```

### 3. Open in Browser

**On your computer:**
- Open http://localhost:8000

**On your mobile device (same WiFi):**
- Open the Network URL (e.g., http://192.168.1.100:8000)

### 4. Test the Flow

1. ✅ Click **"Connect Wallet"**
   - Deep link opens
   - Wallet app launches
   - Approve connection
   - Returns to demo dApp

2. ✅ Enter transaction details:
   - Recipient: `TS-QAJA-QW5Y-SWVP-4RVP4`
   - Amount: `1.0`
   - Message: "Test"

3. ✅ Click **"Send Transaction"**
   - Creates unsigned transaction
   - Deep link opens
   - Wallet app launches
   - Sign transaction
   - Returns to demo dApp
   - See transaction ID

## 📱 Testing on Real Device

Make sure:
- ✅ Your phone and computer are on the **same WiFi network**
- ✅ Use the **Network URL** shown by Vite (not localhost)
- ✅ Wallet app is **installed** on your device

## 🔄 Hot Reload

Vite has hot reload enabled! Edit `index.html` and changes appear instantly.

## 🛑 Stop Server

Press `Ctrl + C` in the terminal.

## 🐛 Troubleshooting

**Can't access from phone:**
- Check firewall settings
- Verify same WiFi network
- Try disabling VPN

**Deep links not working:**
- Ensure wallet app is installed
- Check that deep link scheme is registered
- Try opening deep link manually

**Module errors:**
- Run `npm install` again
- Clear cache: `rm -rf node_modules && npm install`

## 📚 More Info

See [README.md](./README.md) for detailed documentation.
