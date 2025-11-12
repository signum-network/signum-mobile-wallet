import { PUBLIC_CURRENT_OS } from "@/types/constants";

export const getHeaderTitle = (title: string) => {
  switch (PUBLIC_CURRENT_OS) {
    case "android":
      return {
        headerBackTitle: "",
        headerTitle: title,
        headerShown: true,
      };

    default:
      return {
        title: "",
        headerBackTitle: title,
        headerShown: true,
      };
  }
};
