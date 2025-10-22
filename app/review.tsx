import ImagePicker from "@/components/ImagePicker";
import SingleLineEntry from "@/components/SingleLineEntry";
import StandardButton from "@/components/StandardButton";
import { useReviewData } from "@/hooks/useReviewData";
import { removeData } from "@/utils/nukstorage";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function ReviewEditor() {
  const { id } = useLocalSearchParams();
  const reviewId = Array.isArray(id) ? id[0] : id;

  const {
    loading, title, rating, artist, comments, albumCover,
    setTitle, setRating, setArtist, setComments, setAlbumCover, save,
  } = useReviewData(reviewId as string);

  const captureData = async () => {
    await save();
    alert("Review saved!");
    router.back();
  };

  const deleteReview = async () => {
    const confirmed = await getConfirmation("Are you sure you want to delete this review? This is a destructive action!");
    if (confirmed && reviewId) removeData(reviewId);
  };

  const getConfirmation = (message: string) => new Promise<boolean>((resolve) => {
    Alert.alert("Confirmation", message, [
      { text: "Cancel", onPress: () => resolve(false) },
      { text: "Confirm", onPress: () => resolve(true) },
    ], { cancelable: false });
  });

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1, alignItems: "center", justifyContent: "flex-start", width: "100%", paddingHorizontal: 0,
    }}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <ImagePicker value={albumCover} onImageChange={setAlbumCover} type="album" />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>TITLE</Text>
        <SingleLineEntry placeholder="Start typing..." value={title} onChangeText={setTitle} />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>RATING</Text>
        <SingleLineEntry placeholder="Start typing..." value={rating} onChangeText={setRating} />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>ARTIST</Text>
        <SingleLineEntry placeholder="Start typing..." value={artist} onChangeText={setArtist} />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>COMMENTS</Text>
        <SingleLineEntry placeholder="Start typing..." value={comments} onChangeText={setComments} />
      </View>

      <View style={styles.buttonContainer}>
        <StandardButton text="Delete" onPress={deleteReview} backgroundColor="red" />
        <StandardButton text="Save" onPress={captureData} />
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
