import {createSign, generateKeyPairSync} from 'react-native-quick-crypto';

export let isLocal = false;

export function setIsLocal(set: boolean) {
    isLocal = set;
}

const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
});

export const getPublicKey = async (): Promise<string> => {
    if (!publicKey) {
        throw new Error('Public key is missing');
    }
    return publicKey?.toString();
}

export function signPayload(payload: string) {
    const signer = createSign('SHA256');
    signer.update(payload);
    if (!privateKey) {
        throw new Error("Private key not initialized.");
    }
    return signer.sign(privateKey!.toString(), 'base64');
}
