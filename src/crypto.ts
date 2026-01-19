import {createSign, generateKeyPairSync} from 'react-native-quick-crypto';

const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
});

export const getPublicKey = async (): Promise<string> => {
    if (!publicKey) {
        throw new Error('Public key is missing');
    }
    return publicKey?.toString();
}

function signPayload(payload: object, privKey: string) {
    const signer = createSign('SHA256');
    signer.update(JSON.stringify(payload));
    if (!privKey) {
        throw new Error("Private key not initialized.");
    }
    return signer.sign(privateKey!!.toString(), 'base64');
}
