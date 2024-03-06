import { useQuery } from "@tanstack/react-query";
import { PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL } from "@/types/constants";

export const NodeHostInitializer = () => {
  const { isPending, data } = useQuery({
    queryKey: ["fetchReliableNodeHosts"],
    queryFn: () =>
      fetch(`${PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL}/nodes.json`).then((res) =>
        res.json()
      ),
  });

  console.log({ isPending, data });

  return null;
};
