export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    documentType: string;
    expiryDate: string;
    address: string;
    photo: string | null;
    biometricHash: string;
}

export interface QRVerificationData {
    type: "EID_VERIFICATION";
    id: string;
    name: string;
    dob: string;
    nationality: string;
    expiry: string;
    hash: string;
    timestamp: string;
}

export interface EventCheckinData {
    type: "EVENT_CHECKIN";
    eventName?: string;
    venue?: string;
    date?: string;
}

export type QRData = QRVerificationData | EventCheckinData;

export interface ScanResult {
    success: boolean;
    data: QRData | { raw: string };
    message: string;
}

export type RootStackParamList = {
    Home: undefined;
    Scanner: undefined;
};
