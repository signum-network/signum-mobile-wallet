import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "@/features/Welcome/WelcomeScreen";
import WalletCreateSelection from "@/features/AccountCreation/WalletCreateSelection";
import ImportAccount from "@/features/AccountCreation/ImportAccount/ImportAccount";

const MainStack = createNativeStackNavigator();

const FirstRunStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <FirstRunStack.Navigator>
        <FirstRunStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <FirstRunStack.Screen
          name="WalletCreateSelection"
          component={WalletCreateSelection}
          options={{
            headerShown: false,
          }}
        />
        <FirstRunStack.Screen name="ImportAccount" component={ImportAccount} />
      </FirstRunStack.Navigator>
    </NavigationContainer>
  );
}
