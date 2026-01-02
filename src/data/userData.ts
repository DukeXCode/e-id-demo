import { User, QRVerificationData } from "../types";

export const userData: User = {
    id: "NL-2024-84729103",
    firstName: "Jan",
    lastName: "de Vries",
    dateOfBirth: "1990-05-15",
    nationality: "Dutch",
    documentType: "National ID",
    expiryDate: "2029-05-14",
    address: "Keizersgracht 123, Amsterdam",
    photo: null,
    biometricHash: "a1b2c3d4e5f6",
};

export const generateQRData = (user: User): string => {
    const data: QRVerificationData = {
        type: "EID_VERIFICATION",
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        dob: user.dateOfBirth,
        nationality: user.nationality,
        expiry: user.expiryDate,
        hash: user.biometricHash,
        timestamp: new Date().toISOString(),
    };
    return JSON.stringify(data);
};
