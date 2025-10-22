import ImagePicker from "@/components/ImagePicker";
import SingleLineEntry from "@/components/SingleLineEntry";
import StandardButton from "@/components/StandardButton";
import { removeAllReviews, removeData, saveData } from "@/utils/nukstorage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

export default function Index() {
  const [id, setId] = useState("None")
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState("3")
  const [artist, setArtist] = useState("")
  const [comments, setComments] = useState("")
  const [albumCover, setAlbumCover] = useState<string | null>(null);

  const captureData = () => {
    const date = new Date()
    const data = { id, title, rating, artist, comments, date, albumCover, type: "album" };
    saveData(data)
    alert("Review saved!")
    router.back()
  }
    const deleteReview = async() => {
        const confirmed = await getConfirmation("Are you sure you want to delete this review? This is a destructive action!");
        if(confirmed) removeData(id);
    };

    const deleteAllReviews = async() => {
        const confirmed = await getConfirmation("Are you sure you want to delete ALL reviews? This is a destructive action!");
        if(confirmed) removeAllReviews();
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
      <ImagePicker
        value={albumCover}
        onImageChange={setAlbumCover}
        type="album"
      />
    </View>
      <View style={styles.entryContainer}>
        <Text style={styles.label}>TITLE</Text>
        <SingleLineEntry placeholder="Start typing..." value={title} onChangeText={setTitle}></SingleLineEntry>
      </View>
      <View style={styles.entryContainer}>
        <Text style={styles.label}>RATING</Text>
        <SingleLineEntry placeholder="Start typing..." value={rating} onChangeText={setRating}></SingleLineEntry>
      </View>
      <View style={styles.entryContainer}>
        <Text style={styles.label}>ARTIST</Text> 
        <SingleLineEntry placeholder="Start typing..." value={artist} onChangeText={setArtist}></SingleLineEntry>
      </View>
      <View style={styles.entryContainer}>
        <Text style={styles.label}>COMMENTS</Text>
        <SingleLineEntry placeholder="Start typing..." value={comments} onChangeText={setComments}></SingleLineEntry>
      </View>
      <View style={styles.buttonContainer}>
        <StandardButton text="Delete" onPress={deleteReview} backgroundColor="red" />
        <StandardButton text="Save" onPress={captureData} />
      </View>

      <View style={styles.buttonContainer}>
        <StandardButton text="Delete All" onPress={deleteAllReviews} backgroundColor="red" />
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
