import { ScrollView, View } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLedgerService } from "@/hooks/useLedgerService";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Operation } from "./sections/Operation";
import { manageCommitmentSchema } from "./utils/schemas";
import { OperationType, type ManageCommitment } from "./utils/types";

export const CommitmentScreen = () => {
  const { ledgerService } = useLedgerService();

  const methods = useForm<ManageCommitment>({
    mode: "onChange",
    resolver: yupResolver(manageCommitmentSchema),
    defaultValues: {
      type: OperationType.Add,
    },
  });

  const onSubmit: SubmitHandler<ManageCommitment> = async (data) => {
    const { type, amount } = data;
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView>
        <ScrollView>
          <DashboardScreenContainer>
            <View className="flex flex-col items-start justify-center w-full px-4 pt-4 pb-20 gap-4">
              <Balance />
              <Operation onSubmit={methods.handleSubmit(onSubmit)} />
            </View>
          </DashboardScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
