import { getData } from "@/utils/nukstorage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  id: string;
};

type AlbumData = {
  title?: string;
  artist?: string;
  albumCover?: string | null;
};

export default function BasicAlbumCard({ id }: Props) {
  const [data, setData] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      const result = await getData(id);
      setData(result);
      setLoading(false);
    };
    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#888" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>Album not found.</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={() => router.push({pathname: "/review", params: {id}})}>
    <View style={styles.card}>
      {data.albumCover ? (
        <Image source={{ uri: data.albumCover }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ color: "#888" }}>No Cover</Text>
        </View>
      )}
      <Text style={styles.title}>{data.title || "Untitled Album"}</Text>
      <Text style={styles.artist}>{data.artist || "Unknown Artist"}</Text>
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    borderRadius: 10,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    padding: 10,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#ddd",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  artist: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    color: "#a00",
    fontSize: 12,
  },
});
