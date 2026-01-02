import React from "react";
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import IDCard from "../components/IDCard";
import QRCodeDisplay from "../components/QRCodeDisplay";
import {generateQRData, userData} from "../data/userData";
import {colors} from "../theme/colors";
import {useRouter} from "expo-router";

interface InfoCardProps {
    icon: string;
    title: string;
    onPress?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.infoCard} onPress={onPress}>
        <Text style={styles.infoCardIcon}>{icon}</Text>
        <Text style={styles.infoCardTitle}>{title}</Text>
    </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const qrData = generateQRData(userData);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>e-ID Wallet</Text>
                <Text style={styles.headerSubtitle}>Digital Identity</Text>
            </LinearGradient>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.statusBanner}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Identity Verified</Text>
                </View>

                <IDCard user={userData} />

                <QRCodeDisplay data={qrData} title="Authority Verification" />

                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => router.push("/scanner")}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[colors.secondary, colors.accent]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.scanButtonGradient}
                    >
                        <Text style={styles.scanButtonIcon}>📷</Text>
                        <View style={styles.scanButtonContent}>
                            <Text style={styles.scanButtonTitle}>Scan QR Code</Text>
                            <Text style={styles.scanButtonSubtitle}>
                                Verify at events, venues & services
                            </Text>
                        </View>
                        <Text style={styles.scanButtonArrow}>→</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.infoCards}>
                    <InfoCard icon="📋" title="Activity Log" />
                    <InfoCard icon="⚙️" title="Settings" />
                    <InfoCard icon="❓" title="Help" />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        🏛️ Official Government Digital ID
                    </Text>
                    <Text style={styles.footerVersion}>Version 2.1.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
    },
    contentContainer: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    statusBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#e6fffa",
        borderRadius: 20,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.success,
        marginRight: 8,
    },
    statusText: {
        color: colors.success,
        fontWeight: "600",
        fontSize: 14,
    },
    scanButton: {
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    scanButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    scanButtonIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    scanButtonContent: {
        flex: 1,
    },
    scanButtonTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
    scanButtonSubtitle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        marginTop: 2,
    },
    scanButtonArrow: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
    },
    infoCards: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoCardIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    infoCardTitle: {
        fontSize: 12,
        color: colors.text,
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
        marginTop: 32,
        paddingHorizontal: 16,
    },
    footerText: {
        fontSize: 12,
        color: colors.textLight,
    },
    footerVersion: {
        fontSize: 10,
        color: colors.textLight,
        marginTop: 4,
        opacity: 0.6,
    },
});

export default HomeScreen;
