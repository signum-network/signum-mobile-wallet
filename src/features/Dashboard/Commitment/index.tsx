import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAccount } from "@/hooks/useAccount";
import { useLedgerService } from "@/hooks/useLedgerService";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Operation } from "./sections/Operation";
import { manageCommitmentSchema } from "./utils/schemas";
import { OperationType, type ManageCommitment } from "./utils/types";

export const CommitmentScreen = () => {
  const { ledgerService } = useLedgerService();
  const {
    accountData: { balance },
  } = useAccount();

  const availableBalance = useMemo(() => {
    return balance?.availableBalance?.getSigna
      ? Number(balance?.availableBalance?.getSigna())
      : 0;
  }, [balance]);

  const committedBalance = useMemo(() => {
    return balance?.committedBalance?.getSigna
      ? Number(balance?.committedBalance?.getSigna())
      : 0;
  }, [balance]);

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
              <Balance
                availableBalance={availableBalance}
                committedBalance={committedBalance}
              />

              <Operation
                availableBalance={availableBalance}
                committedBalance={committedBalance}
                onSubmit={methods.handleSubmit(onSubmit)}
              />
            </View>
          </DashboardScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
