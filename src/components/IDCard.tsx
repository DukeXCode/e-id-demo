import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";
import { User } from "../types";

interface IDCardProps {
    user: User;
}

const IDCard: React.FC<IDCardProps> = ({ user }) => {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <View style={styles.cardContainer}>
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardHeader}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.countryText}>SWITZERLAND</Text>
                    <Text style={styles.documentType}>{user.documentType}</Text>
                </View>
                <View style={styles.flagContainer}>
                    <Text style={styles.flagEmoji}>🇨🇭</Text>
                </View>
            </LinearGradient>

            <View style={styles.cardBody}>
                <View style={styles.photoSection}>
                    <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoInitials}>
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <InfoRow label="Nachname" value={user.lastName.toUpperCase()} />
                    <InfoRow label="Vorname" value={user.firstName.toUpperCase()} />
                    <InfoRow label="Geburtsdatum" value={formatDate(user.dateOfBirth)} />
                    <InfoRow label="Document No." value={user.id} small />
                    <InfoRow label="Valid Until" value={formatDate(user.expiryDate)} />
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.mrzText}>
                    P&lt;CH{user.lastName.toUpperCase()}
                    {"<".repeat(Math.max(0, 20 - user.lastName.length))}
                    {user.firstName.toUpperCase()}
                </Text>
                <Text style={styles.mrzText}>
                    {user.id.replace(/-/g, "")}
                    {"<".repeat(10)}CH
                </Text>
            </View>
        </View>
    );
};

interface InfoRowProps {
    label: string;
    value: string;
    small?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, small = false }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={small ? styles.valueSmall : styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerContent: {
        flex: 1,
    },
    countryText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 2,
        opacity: 0.9,
    },
    documentType: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
    },
    flagContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    flagEmoji: {
        fontSize: 28,
    },
    cardBody: {
        flexDirection: "row",
        padding: 16,
    },
    photoSection: {
        marginRight: 16,
    },
    photoPlaceholder: {
        width: 90,
        height: 110,
        backgroundColor: colors.border,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    photoInitials: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.textLight,
    },
    infoSection: {
        flex: 1,
    },
    infoRow: {
        marginBottom: 8,
    },
    label: {
        fontSize: 9,
        color: colors.textLight,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    value: {
        fontSize: 14,
        color: colors.text,
        fontWeight: "600",
    },
    valueSmall: {
        fontSize: 12,
        color: colors.text,
        fontWeight: "600",
        fontFamily: "monospace",
    },
    cardFooter: {
        backgroundColor: "#f8f9fa",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    mrzText: {
        fontFamily: "monospace",
        fontSize: 10,
        color: colors.textLight,
        letterSpacing: 1,
    },
});

export default IDCard;
