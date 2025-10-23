import BasicAlbumCard from "@/components/BasicAlbumCard";
import ImagePicker from "@/components/ImagePicker";
import SingleLineEntry from "@/components/SingleLineEntry";
import StandardButton from "@/components/StandardButton";
import { useArtistData } from "@/hooks/useArtistData";
import { getAllReviewsByArtist, removeData } from "@/utils/nukstorage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function ArtistEditor() {
  const { id } = useLocalSearchParams();
  const [reviews, setReviews] = useState<string[]>([]);
  const artistId = Array.isArray(id) ? id[0] : id;

  const {
    loading,
    rating,
    comments,
    image,
    setRating,
    setComments,
    setImage,
    save,
  } = useArtistData(artistId as string);

    const fetchData = async () => {
        const [allReviewData] = await Promise.all([
        getAllReviewsByArtist(artistId),
        ]);
        setReviews(allReviewData || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

  const captureData = async () => {
    await save();
    alert("Artist saved!");
    router.back();
  };

  const deleteArtist = async () => {
    const confirmed = await getConfirmation(
      "Are you sure you want to delete this artist? This is a destructive action!"
    );
    if (confirmed && artistId) removeData(artistId);
  };

  const getConfirmation = (message: string) =>
    new Promise<boolean>((resolve) => {
      Alert.alert(
        "Confirmation",
        message,
        [
          { text: "Cancel", onPress: () => resolve(false) },
          { text: "Confirm", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );

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
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={{fontWeight: "bold", "fontSize": 30, marginTop: 10}}>{artistId}</Text>
        <ImagePicker
          value={image}
          onImageChange={setImage}
          type="other"
        />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>RATING</Text>
        <SingleLineEntry
          placeholder="Start typing..."
          value={rating}
          onChangeText={setRating}
        />
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.label}>COMMENTS</Text>
        <SingleLineEntry
          placeholder="Start typing..."
          value={comments}
          onChangeText={setComments}
        />
      </View>

      <Text style={styles.sectionTitle}>Albums Reviewed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {reviews.length ? reviews.map((id, i) => <BasicAlbumCard key={i} id={String(id)} />)
            : <Text style={{ marginLeft: 10 }}>No album reviews found.</Text>}
        </ScrollView>

      <View style={styles.buttonContainer}>
        <StandardButton text="Delete" onPress={deleteArtist} backgroundColor="red" />
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
    marginTop: -10,
    marginBottom: 50
  },
  horizontalScroll: { marginBottom: 20, paddingHorizontal: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, marginBottom: 2 },
};
