import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {type Amount} from "@signumjs/util";
import {signumBlueSymbolPicture} from "@/assets";
import {Image} from "expo-image";
import {useTicker} from "@/hooks/useTicker";

interface Props {
    amount?: Amount
}

export function SignaDescriptor({amount} : Props) {

    const {NativeTicker} = useTicker()

    return <>
        <View className="w-min-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
                {NativeTicker}
            </Text>

            <Card>
                <View className="flex flex-row items-center justify-start gap-2 w-min-full">
                    <View className="size-10">
                    <Image
                        source={{uri: signumBlueSymbolPicture}}
                        contentFit={"contain"}
                        style={{width: "100%", height: "100%", borderRadius: 8}}
                    />
                    </View>
                    {amount && <Text className="font-medium">{`${amount.getSigna()} ${NativeTicker}`}</Text>}
                </View>
            </Card>
        </View>
    </>

}
