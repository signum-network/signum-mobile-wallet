import { describe, it, expect, vi } from 'vitest';
import nodeCrypto from 'crypto';
import { Buffer } from 'buffer';

vi.mock('react-native-quick-crypto', () => ({
    default: {
        pbkdf2Sync: nodeCrypto.pbkdf2Sync.bind(nodeCrypto),
        randomBytes: nodeCrypto.randomBytes.bind(nodeCrypto),
    },
}));

vi.mock('@/types/constants', () => ({
    PUBLIC_PIN_HASH_ITERATIONS: 100,
}));

const { generateHash, isLegacyHash, verifyLegacyHash } = await import('@/utils/sec/generateHash');

const SECRET = 'test-pin-1234';

describe('generateHash', () => {
    it('returns a key with v2: prefix', async () => {
        const result = await generateHash(SECRET);
        expect(result.key).toMatch(/^v2:/);
    });

    it('returns a base64-encoded salt', async () => {
        const result = await generateHash(SECRET);
        expect(() => Buffer.from(result.salt, 'base64')).not.toThrow();
        expect(Buffer.from(result.salt, 'base64').length).toBe(32);
    });

    it('produces the same hash for the same secret and salt', async () => {
        const first = await generateHash(SECRET);
        const second = await generateHash(SECRET, first.salt);
        expect(first.key).toBe(second.key);
    });

    it('produces different hashes for different secrets with the same salt', async () => {
        const first = await generateHash(SECRET);
        const second = await generateHash('other-pin-5678', first.salt);
        expect(first.key).not.toBe(second.key);
    });

    it('generates a random salt on each call without a provided salt', async () => {
        const first = await generateHash(SECRET);
        const second = await generateHash(SECRET);
        expect(first.salt).not.toBe(second.salt);
    });
});

describe('isLegacyHash', () => {
    it('returns true for hashes without v2: prefix', () => {
        expect(isLegacyHash('abc123==')).toBe(true);
    });

    it('returns false for v2: prefixed hashes', () => {
        expect(isLegacyHash('v2:abc123==')).toBe(false);
    });
});

describe('verifyLegacyHash', () => {
    const makeLegacyHash = (secret: string) => {
        const salt = nodeCrypto.randomBytes(32);
        const saltBase64 = Buffer.from(salt).toString('base64');
        const key = nodeCrypto.pbkdf2Sync(secret, salt, 100, 32, 'sha1').toString('base64');
        return { saltBase64, key };
    };

    it('verifies a correct SHA-1 hash', () => {
        const { saltBase64, key } = makeLegacyHash(SECRET);
        expect(verifyLegacyHash(SECRET, saltBase64, key)).toBe(true);
    });

    it('returns false for wrong secret', () => {
        const { saltBase64, key } = makeLegacyHash(SECRET);
        expect(verifyLegacyHash('wrong-pin', saltBase64, key)).toBe(false);
    });

    it('does not verify a SHA-512 hash', async () => {
        const result = await generateHash(SECRET);
        const strippedKey = result.key.replace('v2:', '');
        expect(verifyLegacyHash(SECRET, result.salt, strippedKey)).toBe(false);
    });
});
