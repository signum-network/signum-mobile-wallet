import { Platform } from "react-native";

export const getHeaderTitle = (title: string) => {
  switch (Platform.OS) {
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
