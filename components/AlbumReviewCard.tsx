import { getData } from "@/utils/nukstorage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

type AlbumReviewCardProps = {
  id: string;
};

type ReviewData = {
  albumCover?: string;
  title?: string;
  artist?: string;
  rating?: number | string;
};

export default function AlbumReviewCard({ id }: AlbumReviewCardProps) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const item = await getData(id);
        setData(item);
      } catch (err) {
        console.error("Error loading review data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#888" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.card}>
        <Text style={{ color: "#666" }}>No data found for ID: {id}</Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push({pathname: "/review", params: {id}})}>
      {/* Album Cover */}
      <Image
        source={{ uri: data.albumCover }}
        style={styles.albumCover}
        resizeMode="cover"
      />

      {/* Title & Artist */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {data.title || "Untitled"}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {data.artist || "Unknown Artist"}
        </Text>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{data.rating ?? "–"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  artist: {
    fontSize: 14,
    color: "#555",
  },
  ratingContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 40,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
