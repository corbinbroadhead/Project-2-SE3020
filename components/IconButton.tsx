import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

export default function IconButton({ text, onClick, icon }: Props) {
  const colors = {text: "white", accent: "gray"}
  
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.button,
        { backgroundColor: colors.accent },
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.text, { color: colors.text }]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "LTSaeada-Regular",
  },
});