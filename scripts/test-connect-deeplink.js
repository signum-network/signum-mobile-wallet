#!/usr/bin/env node

/**
 * Test Script: Connect dApp Deep Link
 *
 * This script generates test deep links for the "connect" action
 * and automatically opens them in the app.
 *
 * Usage: node scripts/test-connect-deeplink.js
 */

const {src22} = require('@signumjs/standards');
const {execSync} = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Prompts user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} User's response
 */
function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

/**
 * Creates a connect deep link
 * @param {Object} config - Configuration
 * @returns {string} Deep link URL
 */
function createConnectDeeplink(config) {
    return src22.createDeeplink({
        domain: 'signum',
        version: 'v1',
        action: 'connect',
        payload: {
            appName: config.appName,
            callbackUrl: config.callbackUrl,
            network: config.network,
        },
    });
}

/**
 * Opens a deeplink in the app using uri-scheme
 * @param {string} deeplink - The deeplink URL to open
 * @param {'ios' | 'android' | 'manual'} platform - Target platform
 * @returns {Promise<void>}
 */
async function openDeeplink(deeplink, platform) {
    console.log(`\nOpening deeplink on ${platform}...`);
    console.log(`Deeplink: ${deeplink}\n`);

    try {
        if (platform === 'ios') {
            execSync(`npx uri-scheme open "${deeplink}" --ios`, {stdio: 'inherit'});
        } else if (platform === 'android') {
            execSync(`npx uri-scheme open "${deeplink}" --android`, {stdio: 'inherit'});
        }
        console.log('\nDeeplink opened successfully!');
    } catch (error) {
        console.error('\nFailed to open deeplink:', error.message);
        console.log('\nYou can manually test the deeplink by copying it above.');
    }
}

async function selectPlatform() {
    console.log('\nSelect platform:\n');
    console.log('  1. iOS Simulator');
    console.log('  2. Android Emulator/Device');
    console.log('  3. Show deeplink only (manual testing)\n');

    const platformChoice = await prompt('Enter platform (1-3): ');

    switch (platformChoice.trim()) {
        case '1':
            return 'ios';
        case '2':
            return 'android';
        case '3':
            return 'manual';
        default:
            console.log('Invalid choice. Defaulting to manual.');
            return 'manual';
    }
}

async function main() {
    console.log('\n🧪 Connect dApp Deep Link Test Generator\n');
    console.log('═'.repeat(60));

    while (true) {
        console.log('\n=== Test Connect Deep Link ===\n');

        // Get configuration from user
        const appName = await prompt('Enter dApp name (default: Test DApp): ') || 'Test DApp';
        const callbackUrl = await prompt('Enter callback URL (default: https://example.com/callback): ')
            || 'https://example.com/callback';
        const networkInput = await prompt('Enter network (mainnet/testnet, default: testnet): ') || 'testnet';
        const network = networkInput.toLowerCase() === 'mainnet' ? 'mainnet' : 'testnet';

        console.log('\n📝 Configuration:');
        console.log(`   App Name: ${appName}`);
        console.log(`   Callback URL: ${callbackUrl}`);
        console.log(`   Network: ${network}`);

        // Create deeplink
        const deeplink = createConnectDeeplink({
            appName,
            callbackUrl,
            network,
        });

        console.log('\n✅ Deeplink generated');

        // Select platform and open
        const platform = await selectPlatform();

        if (platform === 'manual') {
            console.log('\n📋 Manual Testing:');
            console.log(`\nDeeplink:\n${deeplink}\n`);
            console.log('Copy the deeplink above and use one of these methods:\n');
            console.log('  iOS Simulator:');
            console.log(`    xcrun simctl openurl booted "${deeplink}"\n`);
            console.log('  Android:');
            console.log(`    adb shell am start -W -a android.intent.action.VIEW -d "${deeplink}" com.signum.mobile.wallet\n`);
        } else {
            await openDeeplink(deeplink, platform);
        }

        console.log('\n' + '═'.repeat(60));
        console.log('\n📱 Expected Behavior:\n');
        console.log('  1. Wallet opens to "Connect to dApp?" screen');
        console.log(`  2. Shows dApp name: "${appName}"`);
        console.log(`  3. Shows callback URL: "${new URL(callbackUrl).hostname}"`);
        console.log('  4. Shows permissions list');
        console.log('  5. Shows account selector');
        console.log('  6. User can select account and approve');
        console.log(`  7. Wallet redirects to: ${callbackUrl}?publicKey=...&address=...&accountId=...`);
        console.log('     (Will fail if callback URL is not real, but that\'s OK for testing)\n');

        const again = await prompt('\nTest another configuration? (y/n): ');
        if (again.toLowerCase() !== 'y') {
            console.log('\nGoodbye! 👋\n');
            rl.close();
            process.exit(0);
        }
    }
}

// Run the script
main().catch((error) => {
    console.error('Fatal error:', error);
    rl.close();
    process.exit(1);
});
