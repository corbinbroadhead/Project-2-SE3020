import * as ImagePickerExpo from "expo-image-picker";
import React from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";

type ImagePickerProps = {
  value?: string | null; // URI of the image
  onImageChange: (uri: string | null) => void;
  type?: "album" | "other";
};

export default function ImagePicker({ value, onImageChange, type = "other" }: ImagePickerProps) {
  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an image source:",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const cameraPermission = await ImagePickerExpo.requestCameraPermissionsAsync();
            if (cameraPermission.status !== "granted") {
              Alert.alert("Permission denied", "Camera access is required to take photos.");
              return;
            }

            const result = await ImagePickerExpo.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              onImageChange(result.assets[0].uri);
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const libraryPermission = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
            if (libraryPermission.status !== "granted") {
              Alert.alert("Permission denied", "Library access is required to select images.");
              return;
            }

            const result = await ImagePickerExpo.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              onImageChange(result.assets[0].uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          type === "album" ? styles.albumShape : styles.circleShape,
        ]}
      >
        {value ? (
          <Image
            source={{ uri: value }}
            style={[
              styles.image,
              type === "album" ? styles.albumShape : styles.circleShape,
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              type === "album" ? styles.albumShape : styles.circleShape,
            ]}
          />
        )}
      </View>
      <Button title="Select Image" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  imageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  albumShape: {
    borderRadius: 0,
  },
  circleShape: {
    borderRadius: 100,
  },
});
