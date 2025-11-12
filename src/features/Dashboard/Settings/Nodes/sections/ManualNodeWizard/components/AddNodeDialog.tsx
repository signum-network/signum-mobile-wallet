import { Fragment, useState, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useForm,
  FormProvider,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AddNode } from "../utils/types";
import { addNodeSchema } from "../utils/schemas";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { Dialog } from "@/components/Dialog";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { LedgerService } from "@/services/ledgerService";
import Ionicons from "@expo/vector-icons/Ionicons";

export const AddNodeDialog = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { customNodeHost, addCustomNode } = useNodeHostStore();

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const methods = useForm<AddNode>({
    mode: "onChange",
    resolver: yupResolver(addNodeSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const { control, handleSubmit, resetField } = methods;

  useEffect(() => {
    resetField("name");
    resetField("url");
  }, [visible]);

  const onSubmit: SubmitHandler<AddNode> = async (data) => {
    const { name, url } = data;

    try {
      const Ledger = new LedgerService(url);
      const constants = await Ledger.node.fetchNetworkInfo();

      if (!constants.networkName)
        return alert(t("settings.node.invalidNodeUrl"));

      const isNameAlreadyUsed = customNodeHost.some(
        (e) => e.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      );

      const isUrlAlreadyUsed = customNodeHost.some(
        (e) => e.url === Ledger.host
      );

      if (isNameAlreadyUsed)
        return alert(t("settings.node.customNodeNameAlreadyUsed"));

      if (isUrlAlreadyUsed)
        return alert(t("settings.node.customNodeUrlAlreadyUsed"));

      const isTestnet = constants.networkName === "Signum-TESTNET";

      addCustomNode({
        name,
        url: Ledger.host,
        isTestnet,
      });

      alert(t("settings.node.customNodeAdded"));
      hideDialog();
    } catch (error) {
      alert(t("settings.node.invalidNodeUrl"));
    }
  };

  return (
    <Fragment>
      <Dialog variant="full" visible={visible} onClose={hideDialog}>
        <FormProvider {...methods}>
          <View className="flex flex-col items-center justify-center gap-8 w-full">
            <Text size="large" className="font-bold">
              {t("settings.node.addCustomNode")}
            </Text>

            <View className="w-full gap-2">
              <Text className="font-medium">
                {t("settings.node.customNodeName")}
              </Text>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t("settings.node.customNodeName")}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
              />
            </View>

            <View className="w-full gap-2 mb-4">
              <Text className="font-medium">
                {t("settings.node.customNodeUrl")}
              </Text>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t("settings.node.customNodeUrl")}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="url"
              />

              <Text size="small" color="muted">
                {t("example")} https://europe.signum.network/
              </Text>
            </View>
          </View>

          <View className="w-full flex flex-row items-center justify-center gap-2">
            <Button
              icon={<Ionicons name="close" size={24} color="white" />}
              title={t("cancel")}
              type="error"
              pressableProps={{ onPress: hideDialog }}
              extraClassNames="w-1/2"
            />

            <Button
              icon={<Ionicons name="add" size={24} color="white" />}
              title={t("add")}
              type="primary"
              pressableProps={{ onPress: handleSubmit(onSubmit) }}
              extraClassNames="w-1/2"
            />
          </View>
        </FormProvider>
      </Dialog>

      <Button
        icon={
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={iconColor.blackout}
          />
        }
        type="blackout"
        title={t("settings.node.addCustomNode")}
        fullWidth
        pressableProps={{ onPress: showDialog }}
      />
    </Fragment>
  );
};
