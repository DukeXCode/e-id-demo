import { User, QRVerificationData } from "../types";

export const userData: User = {
    id: "K0C38Z46",
    firstName: "Peter",
    lastName: "Schweizer",
    dateOfBirth: "1990-05-15",
    documentType: "Identitätskarte",
    expiryDate: "2029-05-14",
    address: "Strasse 123, Luzern",
    photo: null,
    placeOfOrigin: "Luzern/LU",
    biometricHash: "a1b2c3d4e5f6"
};

export const generateQRData = (user: User): string => {
    const data: QRVerificationData = {
        type: "EID_VERIFICATION",
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        dob: user.dateOfBirth,
        expiry: user.expiryDate,
        hash: user.biometricHash,
        timestamp: new Date().toISOString(),
    };
    return JSON.stringify(data);
};
