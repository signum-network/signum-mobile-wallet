import type { Transaction } from "@signumjs/core";
import { Card } from "@/components/Card";
import {JsonView} from "@/components/JsonView";

interface Props {
  transaction: Transaction;
}

export const JsonPreview = ({ transaction }: Props) => {
  return (
    <Card>
        <JsonView json={transaction} />
    </Card>
  );
};
