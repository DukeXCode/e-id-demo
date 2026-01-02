import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                    name="Scanner"
                    component={ScannerScreen}
                    options={{
                        presentation: "fullScreenModal",
                        animation: "slide_from_bottom",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
