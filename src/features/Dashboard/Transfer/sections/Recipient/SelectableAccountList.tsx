import {Card} from "@/components/Card";
import {View} from "react-native";
import {Text} from "@/components/Text";
import {FlashList} from "@shopify/flash-list";
import {RecipientAccountRowFancy} from "./RecipientAccountRowFancy";

interface Props {
    title: string
    accountIds: string[]
    selectedAccountId: string
    onSelect: (accountId: string) => void
}

export const SelectableAccountList = ({title, accountIds, selectedAccountId, onSelect}: Props) => {

    if (accountIds.length === 0) return null;

    const keyPrefix = `acc-list-${title.slice(0, 6).toLowerCase()}`
    return (
        <Card>
            <View className="w-full mb-2">
                <Text size="large" className="font-medium mb-2">
                    {title}
                </Text>
                <FlashList
                    scrollEnabled={false}
                    data={accountIds}
                    keyExtractor={(accountId) => `${keyPrefix}-${accountId}`}
                    renderItem={({item}) => (
                        <RecipientAccountRowFancy
                            accountId={item}
                            onSelect={onSelect}
                            selectedAccountId={selectedAccountId}
                        />
                    )}
                    ListEmptyComponent={null}
                />
            </View>
        </Card>
    )

}
