let keyPair: CryptoKeyPair | null = null;

/**
 * Initialize the key pair (in memory or secure storage).
 * For production, replace in-memory storage with SecureStore or Keychain.
 */
export const initPrivateKey = async (): Promise<void> => {
    if (keyPair) {
        console.info("Keypair already initialized.");
        return;
    }

    // Generate a strong asymmetric key pair (ECDSA P-256)
    keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256", // or "P-384"
        },
        true, // extractable (so we can export the public key)
        ["sign", "verify"]
    );

    console.info("New ephemeral keypair generated.");
};

/**
 * Export the public key as a Base64-encoded string (for server verification).
 */
export const getPublicKey = async (): Promise<string> => {
    if (!keyPair) throw new Error("Keypair not initialized. Call initPrivateKey() first.");

    const rawKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const base64Key = btoa(String.fromCharCode(...new Uint8Array(rawKey)));

    return base64Key;
};

/**
 * Sign a payload (returns base64 signature)
 */
export const signPayload = async (payload: string): Promise<string> => {
    if (!keyPair) throw new Error("Keypair not initialized. Call initPrivateKey() first.");

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        keyPair.privateKey,
        encoder.encode(payload)
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

/**
 * Verify a payload and signature against a given public key (Base64 string)
 */
export const verifySignature = async (
    payload: string,
    signatureB64: string,
    publicKeyB64: string
): Promise<boolean> => {
    const encoder = new TextEncoder();

    const rawKey = Uint8Array.from(atob(publicKeyB64), (c) => c.charCodeAt(0));

    const importedKey = await crypto.subtle.importKey(
        "spki",
        rawKey.buffer,
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        true,
        ["verify"]
    );

    const signatureBytes = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));

    return crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        importedKey,
        signatureBytes,
        encoder.encode(payload)
    );
};
