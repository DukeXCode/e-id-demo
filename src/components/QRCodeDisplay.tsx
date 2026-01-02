import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "../theme/colors";
import { QRVerificationData } from "../types";

interface QRCodeDisplayProps {
    data: string;
    title?: string;
}

const QR_REFRESH_INTERVAL = 120;

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
                                                         data,
                                                         title = "Scan to Verify",
                                                     }) => {
    const [timeLeft, setTimeLeft] = useState<number>(QR_REFRESH_INTERVAL);
    const [qrData, setQrData] = useState<string>(data);

    const regenerateQR = useCallback(() => {
        try {
            const parsed: QRVerificationData = JSON.parse(data);
            const updated: QRVerificationData = {
                ...parsed,
                timestamp: new Date().toISOString(),
            };
            setQrData(JSON.stringify(updated));
        } catch {
            setQrData(data);
        }
    }, [data]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    regenerateQR();
                    return QR_REFRESH_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [regenerateQR]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                    <QRCode
                        value={qrData}
                        size={200}
                        backgroundColor="white"
                        color={colors.primary}
                    />
                </View>

                <View style={styles.timerContainer}>
                    <View style={styles.timerDot} />
                    <Text style={styles.timerText}>
                        Refreshes in {formatTime(timeLeft)}
                    </Text>
                </View>
            </View>

            <Text style={styles.instruction}>
                Present this QR code to authorities for identity verification
            </Text>

            <View style={styles.securityBadge}>
                <Text style={styles.securityIcon}>🔒</Text>
                <Text style={styles.securityText}>Cryptographically Signed</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 16,
    },
    qrContainer: {
        alignItems: "center",
    },
    qrWrapper: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.background,
        borderRadius: 20,
    },
    timerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
        marginRight: 8,
    },
    timerText: {
        fontSize: 12,
        color: colors.textLight,
    },
    instruction: {
        fontSize: 13,
        color: colors.textLight,
        textAlign: "center",
        marginTop: 16,
        paddingHorizontal: 20,
    },
    securityBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#e6fffa",
        borderRadius: 20,
    },
    securityIcon: {
        marginRight: 6,
    },
    securityText: {
        fontSize: 12,
        color: colors.success,
        fontWeight: "600",
    },
});

export default QRCodeDisplay;
