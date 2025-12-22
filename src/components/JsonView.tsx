import {ScrollView} from "react-native";
import {Text} from "@/components/Text";
import clsx from "clsx";

interface JsonViewProps {
    json: object;
    className?: string;
}

export function JsonView({json, className}: JsonViewProps) {

    return (
        <ScrollView className={clsx("max-h-96", className)}>
            <Text size="small" className="font-mono">
                {JSON.stringify(json, null, 2)}
            </Text>
        </ScrollView>
    )
}
