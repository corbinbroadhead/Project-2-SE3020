import { TextInput } from "react-native";

type Props = {
  placeholder: string;
  size?: number;
  margin?: number;
  value?: string;
  height?: number;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  editable?: boolean;
};

export default function SingleLineEntry({
  placeholder,
  size = 16,
  margin = 2,
  value,
  height = 40,
  onChangeText,
  onSubmitEditing,
  editable = true,
}: Props) {
  const colors = { text: "white", accent: "gray" };

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.text}
      editable={editable}
      style={{
        fontSize: size,
        marginVertical: margin,
        padding: 8,
        borderWidth: 0,
        borderColor: colors.text,
        color: colors.text,
        backgroundColor: colors.accent,
        borderRadius: 6,
        width: "90%",
        height,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
    />
  );
}
