import AlbumReviewCard from "@/components/AlbumReviewCard";
import BasicAlbumCard from "@/components/BasicAlbumCard";
import BasicArtistCard from "@/components/BasicArtistCard";
import { getRecentReviews, getTopAlbums, getTopArtists } from "@/utils/nukstorage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function GetAll() {
  const [reviews, setReviews] = useState<string[]>([]);
  const [topAlbums, setTopAlbums] = useState<string[]>([]);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const [reviewData, topAlbumData, topArtistData] = await Promise.all([
      getRecentReviews(5),
      getTopAlbums(5),
      getTopArtists(5),
    ]);
    setReviews(reviewData || []);
    setTopAlbums(topAlbumData || []);
    setTopArtists(topArtistData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
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
