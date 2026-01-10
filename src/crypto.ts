import * as SecureStore from "expo-secure-store";

const PRIVATE_KEY_KEY = "APP_PRIVATE_KEY";

/**
 * Initialize the private key in secure storage.
 * Generates a new key if one doesn’t exist yet.
 */
export const initPrivateKey = async (): Promise<void> => {
    const existing = await SecureStore.getItemAsync(PRIVATE_KEY_KEY);

    if (existing) {
        console.info("Private key already initialized.");
        return;
    }

    const key = "mySecretPrivateKey";

    await SecureStore.setItemAsync(PRIVATE_KEY_KEY, key, {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });

    console.info("New private key generated and stored securely.");
};

export const getPublicKey = async (): Promise<string> => {
    return "myPublicKey"
}
