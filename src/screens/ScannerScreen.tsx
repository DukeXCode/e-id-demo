import React, {useCallback, useState} from "react";
import {Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View,} from "react-native";
import {BarcodeScanningResult, CameraView, useCameraPermissions} from "expo-camera";
import {colors} from "../theme/colors";
import {QRData, ScanResult} from "../types";
import {useRouter} from "expo-router";
import authenticate from "@/src/insecureAuth";

const { width } = Dimensions.get("window");
const SCAN_AREA_SIZE = width * 0.7;

const ScannerScreen: React.FC = () => {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<boolean>(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);

    const handleBarCodeScanned = useCallback(
        ({ data }: BarcodeScanningResult) => {
            if (scanned) return;

            setScanned(true);
            Vibration.vibrate(100);

            try {
                const parsed = JSON.parse(data) as QRData;
                setScanResult({
                    success: true,
                    data: parsed,
                    message: "Verification Successful",
                });
            } catch {
                setScanResult({
                    success: false,
                    data: { raw: data },
                    message: "Invalid QR Code",
                });
            }

            setShowResult(true);
        },
        [scanned]
    );

    const resetScanner = useCallback(() => {
        setScanned(false);
        setScanResult(null);
        setShowResult(false);
    }, []);

    const handleAuthenticate = useCallback(() => {
        authenticate("https://callback-url.example/path")
        resetScanner();
        router.back();
    }, [resetScanner, router]);

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Requesting camera permission...
                </Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionIcon}>📷</Text>
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionText}>
                    We need camera access to scan QR codes for identity verification.
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isEIDVerification =
        scanResult?.success && "type" in scanResult.data && scanResult.data.type === "EID_VERIFICATION";

    const isEventCheckin =
        scanResult?.success && "type" in scanResult.data && scanResult.data.type === "EVENT_CHECKIN";

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <SafeAreaView style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Scan QR Code</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.scanAreaContainer}>
                        <View style={styles.scanArea}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.instructions}>
                            Align the QR code within the frame to verify
                        </Text>
                        <View style={styles.tipContainer}>
                            <Text style={styles.tipIcon}>💡</Text>
                            <Text style={styles.tipText}>
                                Use this to check-in at events, venues, or verify online
                                services
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </CameraView>

            <Modal visible={showResult} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View
                            style={[
                                styles.resultIcon,
                                scanResult?.success
                                    ? styles.resultIconSuccess
                                    : styles.resultIconError,
                            ]}
                        >
                            <Text style={styles.resultIconText}>
                                {scanResult?.success ? "✓" : "✕"}
                            </Text>
                        </View>

                        <Text style={styles.resultTitle}>{scanResult?.message}</Text>

                        {isEventCheckin && (
                            <View style={styles.eventInfo}>
                                <Text style={styles.eventName}>
                                    {(scanResult.data as { eventName?: string }).eventName ||
                                        "Event Check-in"}
                                </Text>
                                <Text style={styles.eventDetails}>
                                    {(scanResult.data as { venue?: string }).venue || "Venue"} •{" "}
                                    {(scanResult.data as { date?: string }).date || "Today"}
                                </Text>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>
                                        ✓ Identity Shared Securely
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isEIDVerification && (
                            <View style={styles.verificationInfo}>
                                <Text style={styles.verificationLabel}>Verified Identity</Text>
                                <Text style={styles.verificationName}>
                                    {(scanResult.data as { name: string }).name}
                                </Text>
                                <Text style={styles.verificationId}>
                                    ID: {(scanResult.data as { id: string }).id}
                                </Text>
                            </View>
                        )}

                        {!scanResult?.success && (
                            <Text style={styles.errorText}>
                                The scanned QR code is not a valid verification code.
                            </Text>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                onPress={resetScanner}
                            >
                                <Text style={styles.modalButtonSecondaryText}>Scan Again</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonPrimary]}
                                onPress={handleAuthenticate}
                            >
                                <Text style={styles.modalButtonPrimaryText}>Authenticate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 25,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    placeholder: {
        width: 40,
    },
    scanAreaContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanArea: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: colors.accent,
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 12,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 12,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 12,
    },
    footer: {
        padding: 30,
        alignItems: "center",
    },
    instructions: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    tipContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    tipIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    tipText: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        backgroundColor: colors.background,
    },
    permissionIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 12,
    },
    permissionText: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    permissionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        paddingVertical: 12,
    },
    backButtonText: {
        color: colors.textLight,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.cardBackground,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: "center",
    },
    resultIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    resultIconSuccess: {
        backgroundColor: "#d4edda",
    },
    resultIconError: {
        backgroundColor: "#f8d7da",
    },
    resultIconText: {
        fontSize: 36,
        fontWeight: "bold",
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 16,
    },
    eventInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    eventName: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
    },
    eventDetails: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 4,
    },
    verifiedBadge: {
        backgroundColor: "#d4edda",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
    },
    verifiedText: {
        color: colors.success,
        fontWeight: "600",
    },
    verificationInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    verificationLabel: {
        fontSize: 12,
        color: colors.textLight,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    verificationName: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 8,
    },
    verificationId: {
        fontSize: 14,
        color: colors.textLight,
        fontFamily: "monospace",
        marginTop: 4,
    },
    errorText: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    modalButtonSecondary: {
        backgroundColor: colors.background,
    },
    modalButtonSecondaryText: {
        color: colors.text,
        fontWeight: "600",
        fontSize: 16,
    },
    modalButtonPrimary: {
        backgroundColor: colors.primary,
    },
    modalButtonPrimaryText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default ScannerScreen;
