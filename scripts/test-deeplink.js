#!/usr/bin/env node

/**
 * Deep Link Testing Script for Signum Mobile Wallet
 *
 * This script generates test deep links for signing transactions
 * and automatically opens them in the app using uri-scheme.
 *
 * Usage: node scripts/test-deeplink.js
 */

const {LedgerClientFactory, Attachment, AttachmentMessage} = require('@signumjs/core');
const {src22} = require('@signumjs/standards');
const {execSync} = require('child_process');
const readline = require('readline');

// Test configuration (Testnet)

// @DEV: Update these values to test with your own account.
const CONFIG = {
    nodeHost: 'https://europe3.testnet.signum.network',
    testSender: '6502115112683865257', // K37B
    testSenderPublicKey: '7210b8941929030324540238450e985899989a7ad0267e0c76f668fde3b1016b',
    testRecipient: '2402520554221019656', // QAJA
    testRecipientPublicKey: 'c213e4144ba84af94aae2458308fae1f0cb083870c8f3012eea58147f3b09d4a',
    testAmount: '100000000', // 1 SIGNA
    testFee: '1000000', // 0.01 SIGNA
    testMessage: 'Test message from deeplink script',
    testTokenId: '123456789',
    testContractReference: 'test-contract-ref',
};

const SCENARIOS = {
    '1': {
        name: 'Send Single Amount',
        description: 'Basic SIGNA transfer to a single recipient',
        handler: createSendAmountTransaction,
    },
    '2': {
        name: 'Send Multi-Out',
        description: 'Transfer SIGNA to multiple recipients',
        handler: createMultiOutTransaction,
    },
    '3': {
        name: 'Send Message',
        description: 'Send a plain text message',
        handler: createMessageTransaction,
    },
    '4': {
        name: 'Send Tokens',
        description: 'Transfer tokens/assets',
        handler: createTokenTransaction,
    },
    '5': {
        name: 'Send Encrypted Message',
        description: 'Send an encrypted message',
        handler: createEncryptedMessageTransaction,
    },
};

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
 * Creates an unsigned send amount transaction
 * @param {import('@signumjs/core').Ledger} ledger - Ledger API instance
 * @returns {Promise<string>} Unsigned transaction bytes
 */
async function createSendAmountTransaction(ledger) {
    console.log('Creating send amount transaction...');

    const msg = new AttachmentMessage({message: CONFIG.testMessage, messageIsText: true});
    const unsignedTransaction = await ledger.transaction.sendAmountToSingleRecipient({
        recipientId: CONFIG.testRecipient,
        recipientPublicKey: CONFIG.testRecipientPublicKey,
        amountPlanck: CONFIG.testAmount,
        feePlanck: CONFIG.testFee,
        publicKey: CONFIG.testSenderPublicKey,
        attachment: msg
    })

    return unsignedTransaction.unsignedTransactionBytes;
}

/**
 * Creates an unsigned multi-out transaction
 * @param {import('@signumjs/core').Api} ledger - Ledger API instance
 * @returns {Promise<string>} Unsigned transaction bytes
 */
async function createMultiOutTransaction(ledger) {
    console.log('Creating multi-out transaction...');

    const unsignedTransaction = await ledger.transaction.sendAmountToMultipleRecipients({
        recipients: [
            {recipient: CONFIG.testRecipient, amountNQT: CONFIG.testAmount},
        ],
        feePlanck: CONFIG.testFee,
        publicKey: CONFIG.testSenderPublicKey,
    });

    return unsignedTransaction.unsignedTransactionBytes;
}

/**
 * Creates an unsigned message transaction
 * @param {import('@signumjs/core').Api} ledger - Ledger API instance
 * @returns {Promise<string>} Unsigned transaction bytes
 */
async function createMessageTransaction(ledger) {
    console.log('Creating message transaction...');

    const unsignedTransaction = await ledger.message.sendMessage({
        message: CONFIG.testMessage,
        recipientId: CONFIG.testRecipient,
        feePlanck: CONFIG.testFee,
        publicKey: CONFIG.testSenderPublicKey,
    });

    return unsignedTransaction.unsignedTransactionBytes;
}

/**
 * Creates an unsigned token transfer transaction
 * @param {import('@signumjs/core').Api} ledger - Ledger API instance
 * @returns {Promise<string>} Unsigned transaction bytes
 */
async function createTokenTransaction(ledger) {
    console.log('Creating token transfer transaction...');
    console.log('Note: Using test token ID. This may fail if token does not exist on testnet.');

    // Note: This is a simplified example. In reality, you'd need a valid asset ID.
    const unsignedTransaction = await ledger.asset.transferAsset({
        recipientId: CONFIG.testRecipient,
        assetId: CONFIG.testTokenId,
        quantity: '100',
        feePlanck: CONFIG.testFee,
        publicKey: CONFIG.testSenderPublicKey,
    });

    return unsignedTransaction.unsignedTransactionBytes;
}

/**
 * Creates an unsigned encrypted message transaction
 * @param {import('@signumjs/core').Api} ledger - Ledger API instance
 * @returns {Promise<string>} Unsigned transaction bytes
 */
async function createEncryptedMessageTransaction(ledger) {
    console.log('Creating encrypted message transaction...');
    console.log('Note: Encryption requires recipient public key.');

    const unsignedTransaction = await ledger.message.sendEncryptedMessage({
        message: CONFIG.testMessage,
        recipientId: CONFIG.testRecipient,
        recipientPublicKey: CONFIG.testRecipientPublicKey,
        feePlanck: CONFIG.testFee,
        publicKey: CONFIG.testSenderPublicKey,
    });

    return unsignedTransaction.unsignedTransactionBytes;
}

/**
 * Creates an SRC-22 deeplink from unsigned transaction bytes
 * @param {string} unsignedTransactionBytes - Unsigned transaction bytes in hex
 * @returns {string} SRC-22 deeplink URL
 */
function createDeeplink(unsignedTransactionBytes) {
    console.log('\nCreating SRC-22 deeplink...');

    return src22.createDeeplink({
        domain: 'signum',
        version: 'v1',
        action: 'sign',
        payload: {
            unsignedTransactionBytes,
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

function displayMenu() {
    console.log('\n=== Signum Mobile Wallet - Deep Link Test Generator ===\n');
    console.log('Select a transaction scenario:\n');

    Object.entries(SCENARIOS).forEach(([key, scenario]) => {
        console.log(`  ${key}. ${scenario.name}`);
        console.log(`     ${scenario.description}\n`);
    });

    console.log('  q. Quit\n');
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
    console.log('\n🚀 Starting Deep Link Test Generator...\n');
    console.log('Configuration:');
    console.log(`  Network: Testnet`);
    console.log(`  Node: ${CONFIG.nodeHost}`);
    console.log(`  Test Recipient: ${CONFIG.testRecipient}\n`);

    const ledger = LedgerClientFactory.createClient({
        nodeHost: CONFIG.nodeHost,
    });

    while (true) {
        displayMenu();

        const choice = await prompt('Enter your choice: ');

        if (choice.toLowerCase() === 'q') {
            console.log('\nGoodbye! 👋\n');
            rl.close();
            process.exit(0);
        }

        const scenario = SCENARIOS[choice.trim()];

        if (!scenario) {
            console.log('\n❌ Invalid choice. Please try again.\n');
            continue;
        }

        console.log(`\n📝 Selected: ${scenario.name}\n`);

        try {
            // Create unsigned transaction
            const unsignedTransactionBytes = await scenario.handler(ledger);

            if (!unsignedTransactionBytes) {
                throw new Error('Failed to create unsigned transaction');
            }

            console.log('✅ Unsigned transaction created');
            console.log(`   Transaction bytes: ${unsignedTransactionBytes.substring(0, 40)}...`);

            // Create deeplink
            const deeplink = createDeeplink(unsignedTransactionBytes);
            console.log('✅ Deeplink generated');

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

            const again = await prompt('\nTest another scenario? (y/n): ');
            if (again.toLowerCase() !== 'y') {
                console.log('\nGoodbye! 👋\n');
                rl.close();
                process.exit(0);
            }
        } catch (error) {
            console.error('\n❌ Error:', error.message);
            console.log('\nPlease try again or check your network connection.\n');
        }
    }
}

// Run the script
main().catch((error) => {
    console.error('Fatal error:', error);
    rl.close();
    process.exit(1);
});
