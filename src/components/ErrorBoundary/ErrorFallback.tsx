import {View, ScrollView} from "react-native";
import {useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Button} from "@/components/Button";
import {Text} from "@/components/Text";
import {useAppTheme} from "@/hooks/useAppTheme";
import {ResetWalletDialog} from "@/components/ResetWalletDialog";

const isDevelopment = __DEV__;

interface Props {
    error: Error | null;
    resetError: () => void;
}

export const ErrorFallback = ({error, resetError}: Props) => {
    const router = useRouter();
    const {iconColor, tokens} = useAppTheme();

    const handleGoHome = () => {
        resetError();
        router.replace("/dashboard/overview");
    };

    return (
        <View
            style={{flex: 1, backgroundColor: tokens.background}}
            className="flex-1"
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <View className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
                    <View className="flex items-center justify-center mb-2">
                        <Ionicons
                            name="alert-circle"
                            size={80}
                            color={iconColor.red}
                        />
                    </View>

                    <Text size="large" className="font-bold text-center">
                        Something Went Wrong
                    </Text>

                    <Text size="medium" className="text-center" color="muted">
                        The app encountered an unexpected error. You can try returning to
                        the home screen or reset the app completely.
                    </Text>
                    <View className="w-full flex flex-col gap-3 mt-4">
                        <Button
                            icon={<Ionicons name="home" size={24} color="white"/>}
                            title="Go to Home"
                            type="primary"
                            pressableProps={{onPress: handleGoHome}}
                            fullWidth
                        />
                        <ResetWalletDialog variant="accent"/>
                    </View>
                    {isDevelopment && error && (
                        <View
                            className="w-full p-4 rounded-lg border"
                            style={{
                                backgroundColor: tokens.surfaceElevated,
                                borderColor: tokens.border,
                            }}
                        >
                            <Text size="small" className="font-bold mb-2">
                                Error Details (Development Only):
                            </Text>
                            <Text size="small" color="muted" className="font-mono">
                                {error.message}
                            </Text>
                            {error.stack && (
                                <Text size="small" color="muted" className="font-mono mt-2">
                                    {error.stack.split("\n").slice(0, 5).join("\n")}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
