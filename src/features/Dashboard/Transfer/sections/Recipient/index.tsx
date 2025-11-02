import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import type { BarcodeScanningResult } from "expo-camera";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { CameraDialog } from "@/components/CameraDialog";
import type { TransactionCreation } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";
import { FlashList } from "@shopify/flash-list";
import { useAccountStore } from "@/hooks/useAccountStore";
import { RecipientAccountRow } from "../../components/RecipientAccountRow";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { recipientsStore } from "@/states/recipientsStore";
import { Address } from "@signumjs/core";
import { useLedgerService } from "@/hooks/useLedgerService";

export const Recipient = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<TransactionCreation>();
  const { accounts, activeAccount } = useAccountStore();
  const { ledgerService } = useLedgerService();

  const recipients = recipientsStore((s) => s.getAll());
  const [recipientProfiles, setRecipientProfiles] = useState<
    Record<string, { name?: string; description?: string }>
  >({});

  const onCodeScanned = (data: BarcodeScanningResult) => {
    setValue("recipient", data.data);
  };

  const accountsList = Object.values(accounts)
    .filter((a) => a.publicKey !== activeAccount)
    .sort((a, b) => b.addedAt - a.addedAt);

  const accountsSet = new Set(Object.keys(accounts));
  const recipientList = recipients.filter((r) => !accountsSet.has(r.publicKey));

  useEffect(() => {
    let cancelled = false;
    const loadProfiles = async () => {
      if (!ledgerService || recipientList.length === 0) return;

      const entries = await Promise.all(
        recipientList.map(async (r) => {
          try {
            const accountId = Address.fromPublicKey(r.publicKey).getNumericId();
            const acc = await ledgerService.ledgerInstance.account.getAccount({
              accountId,
            });

            const rawName = (acc?.name ?? "").trim();
            const shortName =
              rawName.length > 30 ? `${rawName.slice(0, 30)}…` : rawName;
            return [
              r.publicKey,
              {
                name: shortName || undefined,
                description: acc?.description ?? "",
              },
            ] as const;
          } catch {
            return [r.publicKey, { name: undefined, description: "" }] as const;
          }
        })
      );

      if (!cancelled) {
        setRecipientProfiles(Object.fromEntries(entries));
      }
    };

    loadProfiles();
    return () => {
      cancelled = true;
    };
  }, [ledgerService, recipientList]);

  const handleSelect = (rs: string) => {
    setValue("recipient", rs, { shouldValidate: true, shouldDirty: true });
  };

  const selectedRS = (watch("recipient") as string) || null;

  return (
    <>
      <View className="flex-1 w-full">
        <View className="grow w-full gap-4 mb-4">
          <Card>
            <View>
              <Text size="large" className="font-medium">
                {t("recipient")}
              </Text>

              <Text size="large" color="muted" className="font-medium">
                {t("transfer.recipientDescription")}
              </Text>
            </View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={t("example") + " S-5MS6..., 167552..."}
                  onBlur={onBlur}
                  returnKeyType="done"
                  onChangeText={onChange}
                  value={value}
                  size="large"
                  extraClassNames="font-bold"
                />
              )}
              name="recipient"
            />
            <CameraDialog expected="address" onCodeScanned={onCodeScanned} />
            <ResolvedAccountCard simple />
          </Card>
          <HorizontalDivider />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
          {accountsList.length > 0 && (
            <Card>
              <View className="w-full mb-2">
                <Text size="large" className="font-medium mb-2">
                  {t("transfer.yourAccounts")}
                </Text>
                <FlashList
                  scrollEnabled={false}
                  data={accountsList}
                  keyExtractor={({ publicKey }) => `acc-${publicKey}`}
                  renderItem={({ item }) => (
                    <RecipientAccountRow
                      publicKey={item.publicKey}
                      walletName={item.walletName}
                      onSelect={handleSelect}
                      selectedRS={selectedRS}
                    />
                  )}
                  ListEmptyComponent={null}
                />
              </View>
            </Card>
          )}
          <View className="h-4" />
          {recipientList.length > 0 && (
            <Card>
              <View className="w-full mb-2">
                <Text size="large" className="font-medium mb-2">
                  {t("transfer.recentRecipients")}
                </Text>
                <FlashList
                  scrollEnabled={false}
                  data={recipientList}
                  keyExtractor={({ publicKey }) => `rec-${publicKey}`}
                  renderItem={({ item }) => (
                    <RecipientAccountRow
                      publicKey={item.publicKey}
                      walletName={recipientProfiles[item.publicKey]?.name ?? ""}
                      descriptionOverride={
                        recipientProfiles[item.publicKey]?.description ?? ""
                      }
                      onSelect={handleSelect}
                      selectedRS={selectedRS}
                    />
                  )}
                  ListEmptyComponent={null}
                />
              </View>
            </Card>
          )}
          <View className="h-24" />
        </ScrollView>
      </View>
    </>
  );
};
