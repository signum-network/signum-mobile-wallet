import { Text as RNText, type StyleProp, type TextStyle } from "react-native";

export const SignaSymbol = ({
  size = 14,
  style,
}: {
  size?: number;
  style?: StyleProp<TextStyle>;
}) => (
  <RNText style={[{ fontFamily: "SignumSymbols", fontSize: size }, style]}>
    {"\uA7A8"}
  </RNText>
);
