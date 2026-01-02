export const colors = {
    primary: "#1a365d",
    primaryLight: "#2c5282",
    secondary: "#2b6cb0",
    accent: "#4299e1",
    background: "#f7fafc",
    cardBackground: "#ffffff",
    text: "#1a202c",
    textLight: "#718096",
    border: "#e2e8f0",
    success: "#38a169",
    error: "#e53e3e",
} as const;

export type ColorKey = keyof typeof colors;
