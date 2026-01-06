import {View, Pressable} from "react-native";
import {Text} from "@/components/Text";
import {useAppTheme} from "@/hooks/useAppTheme";

interface MimeTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const MIME_TYPES = [
    {value: "image/jpeg", label: "JPG"},
    {value: "image/png", label: "PNG"},
    {value: "image/webp", label: "WebP"},
    {value: "image/gif", label: "GIF"},
    {value: "image/svg+xml", label: "SVG"},
];

export const MimeTypeSelector = ({value, onChange}: MimeTypeSelectorProps) => {
    const {tokens} = useAppTheme();

    return (
        <View className="flex-row flex-wrap gap-2">
            {MIME_TYPES.map((type) => {
                const isSelected = value === type.value;
                return (
                    <Pressable
                        key={type.value}
                        onPress={() => onChange(type.value)}
                        className="rounded-lg px-4 py-2 active:opacity-70"
                        style={{
                            backgroundColor: isSelected ? tokens.primary : tokens.surfaceElevated,
                            borderWidth: 1,
                            borderColor: isSelected ? tokens.primary : "transparent",
                        }}
                    >
                        <Text
                            size="small"
                            className="font-medium"
                            style={{
                                color: isSelected ? "#FFFFFF" : tokens.text,
                            }}
                        >
                            {type.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};