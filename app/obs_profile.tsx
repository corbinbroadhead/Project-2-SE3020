import AlbumReviewCard from "@/components/AlbumReviewCard";
import BasicAlbumCard from "@/components/BasicAlbumCard";
import BasicArtistCard from "@/components/BasicArtistCard";
import ImagePicker from "@/components/ImagePicker";
import SingleLineEntry from "@/components/SingleLineEntry";
import { getData, getRecentReviews, getTopAlbums, getTopArtists, saveData } from "@/utils/nukstorage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function GetAll() {
  const [reviews, setReviews] = useState<string[]>([]);
  const [topAlbums, setTopAlbums] = useState<string[]>([]);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [reviewData, topAlbumData, topArtistData, storedImage, storedUsername] = await Promise.all([
        getRecentReviews(5),
        getTopAlbums(3),
        getTopArtists(3),
        getData("userImage"),
        getData("userUsername"),
      ]);
      setReviews(reviewData || []);
      setTopAlbums(topAlbumData || []);
      setTopArtists(topArtistData || []);
      setImage(storedImage?.image || null);
      setUsername(storedUsername?.username || "User");
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleImageChange = async (uri: string | null) => {
    setImage(uri);
    try {
      await saveData({ id: "userImage", image: uri, type: "user" });
      alert("Image updated!");
    } catch (err) {
      alert("Failed to update image.");
    }
  };

  const handleUsernameChange = async (newName: string) => {
    setUsername(newName);
    try {
      await saveData({ id: "userUsername", username: newName });
      alert("Username updated!");
    } catch (err) {
      alert("Failed to update username.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <SingleLineEntry
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={() => handleUsernameChange(username)}
        />
        <ImagePicker value={image} onImageChange={handleImageChange} type="other" />
      </View>

      <Text style={styles.sectionTitle}>Top Artists</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {topArtists.length ? topArtists.map((id, i) => <BasicArtistCard key={i} id={String(id)} />)
          : <Text style={{ marginLeft: 10 }}>No top artists found.</Text>}
      </ScrollView>

      <Text style={styles.sectionTitle}>Top Albums</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {topAlbums.length ? topAlbums.map((id, i) => <BasicAlbumCard key={i} id={String(id)} />)
          : <Text style={{ marginLeft: 10 }}>No top albums found.</Text>}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent Reviews</Text>
      {reviews.length ? reviews.map((id, i) => <AlbumReviewCard key={i} id={String(id)} />)
        : <View style={styles.center}><Text>No recent reviews found.</Text></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingVertical: 10 },
  horizontalScroll: { marginBottom: 20, paddingHorizontal: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, marginVertical: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
