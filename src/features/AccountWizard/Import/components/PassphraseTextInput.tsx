import { useMemo } from "react";
import {
  View,
  Pressable,
  TextInput as NativeTextInput,
  Text as RNText,
  type TextInputProps,
  Platform,
} from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  wordlist: Set<string>;
  validateWords?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

const splitKeepingSpaces = (text: string) => text.split(/(\s+)/);

const getCurrentWord = (text: string) => {
  const match = text.match(/(?:^|\s)(\S*)$/);
  return match?.[1] ?? "";
};

const replaceCurrentWord = (text: string, suggestion: string) => {
  return text.replace(/(?:^|\s)(\S*)$/, (match) => {
    const startsWithSpace = /^\s/.test(match);
    return `${startsWithSpace ? " " : ""}${suggestion} `;
  });
};

export const PassphraseTextInput = ({
  value,
  onChangeText,
  wordlist,
  validateWords = true,
  showSuggestions = false,
  maxSuggestions = 5,
  ...props
}: Props) => {
  const { tokens } = useAppTheme();

  const parts = useMemo(() => splitKeepingSpaces(value || ""), [value]);

  const currentWord = useMemo(() => getCurrentWord(value || ""), [value]);

  const suggestions = useMemo(() => {
    if (!showSuggestions || !validateWords) return [];
    if (currentWord.length < 2) return [];

    return Array.from(wordlist)
      .filter((word) => word.startsWith(currentWord.toLowerCase()))
      .slice(0, maxSuggestions);
  }, [currentWord, showSuggestions, validateWords, wordlist, maxSuggestions]);

  return (
    <View className="w-full">
      <View
        style={{
          minHeight: 130,
          borderWidth: 1,
          borderColor: tokens.border,
          borderRadius: 8,
          backgroundColor: tokens.surfaceElevated,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <RNText
            style={{
              fontSize: 18,
              lineHeight: 24,
              color: tokens.text,
            }}
          >
            {parts.map((part, index) => {
              const isSpace = /^\s+$/.test(part);

              const nextPart = parts[index + 1] || "";
              const isCompletedWord = isSpace || /^\s+$/.test(nextPart);

              const isInvalid =
                validateWords &&
                !isSpace &&
                part.length > 0 &&
                isCompletedWord &&
                !wordlist.has(part);

              return (
                <RNText
                  key={`${part}-${index}`}
                  style={{
                    fontSize: 18,
                    lineHeight: 24,
                    color: isInvalid ? tokens.error : tokens.text,
                    textDecorationLine: isInvalid ? "underline" : "none",
                    textDecorationColor: isInvalid ? tokens.error : undefined,
                  }}
                >
                  {part}
                </RNText>
              );
            })}
          </RNText>
        </View>

        <NativeTextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          importantForAutofill="no"
          textContentType="none"
          keyboardType="visible-password"
          placeholderTextColor={tokens.textMuted}
          underlineColorAndroid="transparent"
          allowFontScaling={false}
          style={{
            minHeight: 130,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 18,
            lineHeight: 24,
            color:
              Platform.OS === "android"
                ? "rgba(0,0,0,0.01)"
                : "rgba(0,0,0,0.001)",
            backgroundColor: "transparent",
            borderRadius: 8,
            zIndex: 2,
            borderWidth: 0,
            includeFontPadding: false,
          }}
          selectionColor={tokens.primary}
        />
      </View>

      <View
        style={{
          paddingTop: 8,
          minHeight: 38,
          justifyContent: "center",
        }}
      >
        {suggestions.length > 0 &&
          !(suggestions.length === 1 && suggestions[0] === currentWord.toLowerCase()) && (
          <View className="flex-row flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() =>
                  onChangeText(replaceCurrentWord(value, suggestion))
                }
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: tokens.primary,
                  backgroundColor: tokens.primary,
                }}
              >
                <RNText style={{ color: tokens.text, fontSize: 14 }}>
                  {suggestion}
                </RNText>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
