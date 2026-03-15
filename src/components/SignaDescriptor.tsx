import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {type Amount} from "@signumjs/util";
import {signumBlueSymbolPicture} from "@/assets";
import {Image} from "expo-image";
import {useTicker} from "@/hooks/useTicker";
import {formatNumber} from "@/utils/formatNumber";

interface Props {
    amount?: Amount
}

export function SignaDescriptor({amount} : Props) {

    const {NativeTicker} = useTicker()

    return <>
        <Card>
            <View className="flex flex-row items-center justify-start gap-2 w-full">
                <View className="size-10 flex-shrink-0">
                    <Image
                        source={{uri: signumBlueSymbolPicture}}
                        contentFit={"contain"}
                        style={{width: "100%", height: "100%", borderRadius: 8}}
                    />
                </View>
                <View className="flex-1 min-w-0">
                    {amount && <Text className="font-medium">{`${formatNumber({
                        value: Number(amount.getSigna())
                    })} ${NativeTicker}`}</Text>}
                </View>
            </View>
        </Card>
    </>

}
