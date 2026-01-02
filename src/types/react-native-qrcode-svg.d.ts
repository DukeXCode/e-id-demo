declare module "react-native-qrcode-svg" {
    import { Component } from "react";
    import { ImageSourcePropType } from "react-native";

    interface QRCodeProps {
        value: string;
        size?: number;
        color?: string;
        backgroundColor?: string;
        logo?: ImageSourcePropType;
        logoSize?: number;
        logoBackgroundColor?: string;
        logoBorderRadius?: number;
        logoMargin?: number;
        ecl?: "L" | "M" | "Q" | "H";
        getRef?: (ref: any) => void;
        onError?: (error: Error) => void;
        quietZone?: number;
        enableLinearGradient?: boolean;
        linearGradient?: string[];
        gradientDirection?: string[];
    }

    export default class QRCode extends Component<QRCodeProps> {}
}
