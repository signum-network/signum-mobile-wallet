import {ScrollView, View} from "react-native";
import {Text} from "@/components/Text";

import clsx from "clsx";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";

interface JsonViewProps {
    json: object;
    className?: string;
}

export function JsonView({json, className}: JsonViewProps) {

    const isSrc44 = useMemo(() => {
        try{
            src44.DescriptorData.parse(JSON.stringify(json))
            return true
        }catch {
            return false
        }
    }, [json])

    return (
        <ScrollView className={clsx("relative", className)}>
            { isSrc44 && (
            <View className="absolute right-0 border-green-200 bg-green-100 px-1 rounded">
                <Text color="muted" size="small" >SRC44</Text>
            </View>
            )}
            <Text size="small" style={{fontFamily: "SpaceMono_400Regular"}}>
                {JSON.stringify(json, null, 2)}
            </Text>
        </ScrollView>
    )
}
