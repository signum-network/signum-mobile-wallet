import {ScrollView} from "react-native";
import {Text} from "@/components/Text";

import clsx from "clsx";

interface JsonViewProps {
    json: object;
    className?: string;
}

export function JsonView({json, className}: JsonViewProps) {

    return (
        <ScrollView className={clsx("h-[90%]", className)}>
            <Text size="small" style={{fontFamily: "SpaceMono_400Regular"}}>
                {JSON.stringify(json, null, 2)}
            </Text>
        </ScrollView>
    )
}
