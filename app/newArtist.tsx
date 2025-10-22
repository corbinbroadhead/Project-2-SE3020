import ImagePicker from "@/components/ImagePicker";
import SingleLineEntry from "@/components/SingleLineEntry";
import StandardButton from "@/components/StandardButton";
import { removeAllArtists, removeData, saveData } from "@/utils/nukstorage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

export default function NewArtist() {
  const [id, setId] = useState("");
  const [rating, setRating] = useState("3");
  const [comments, setComments] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const captureData = () => {
    const date = new Date();
    const data = { id, rating, comments, date, image, type: "artist", albums: [] };
    saveData(data);
    alert("Artist saved!");
    router.back();
  };

  const deleteArtist = async() => {
    const confirmed = await getConfirmation("Are you sure you want to delete this artist? This is a destructive action!");
    if(confirmed) removeData(id);
  };

  const deleteAllArtists = async() => {
    const confirmed = await getConfirmation("Are you sure you want to delete ALL artists? This is a destructive action!");
    if(confirmed) removeAllArtists();
  };

  const getConfirmation = (message: string) => new Promise<boolean>((resolve)=>{
    Alert.alert(
        "Confirmation",
        message,
        [
        { text: "Cancel", onPress: () => resolve(false) },
        { text: "Confirm", onPress: () => resolve(true) }
        ],
        { cancelable: false }
    );
  });


  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 0,
      }}
    >
      <View style={{ width: "100%", alignItems: "center"}}>
        <ImagePicker value={image} onImageChange={setImage} type="other" />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>NAME</Text>
        <SingleLineEntry placeholder="Start typing..." value={id} onChangeText={setId} />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>RATING</Text>
        <SingleLineEntry placeholder="Start typing..." value={rating} onChangeText={setRating} />
      </View>

      <View style={[styles.entryContainer, {marginBottom: 40}]}>
        <Text style={styles.label}>COMMENTS</Text>
        <SingleLineEntry placeholder="Start typing..." value={comments} onChangeText={setComments} />
      </View>

      <View style={styles.buttonContainer}>
        <StandardButton text="Delete" onPress={deleteArtist} backgroundColor="red" />
        <StandardButton text="Save" onPress={captureData} />
      </View>

      <View style={styles.buttonContainer}>
        <StandardButton text="Delete All" onPress={deleteAllArtists} backgroundColor="red" />
        <StandardButton text="View Profile" onPress={() => router.push("/profile")} />
      </View>
    </ScrollView>
  );
}

const styles = {
  entryContainer: {
    width: "75%",
    maxWidth: 500,
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    width: "90%",
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "40%",
    maxWidth: 500,
    marginTop: 10,
  },
};
