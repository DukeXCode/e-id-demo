import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ToggleButtonProps {
    onToggle?: (isOn: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle }) => {
    const [isOn, setIsOn] = useState(false);

    const handlePress = () => {
        const newState = !isOn;
        setIsOn(newState);
        onToggle?.(newState);
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: isOn ? '#4CAF50' : '#ccc' }
            ]}
            onPress={handlePress}
        >
            <Text style={styles.text}>
                {isOn ? 'LOCAL' : 'CENTRAL'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ToggleButton;
