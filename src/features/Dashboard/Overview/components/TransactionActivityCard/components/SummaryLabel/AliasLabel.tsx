import { useTopLevelDomain } from "@/hooks/useTopLevelDomain";
import { NeutralText } from "./NeutralText";

interface Props {
  aliasName: string;
  tldId: string;
}

export const AliasLabel = ({ aliasName, tldId }: Props) => {
  const topLevelDomain = useTopLevelDomain(tldId);

  return <NeutralText value={`${aliasName}.${topLevelDomain}`} />;
};
