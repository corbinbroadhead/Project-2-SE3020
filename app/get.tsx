import SingleLineEntry from "@/components/SingleLineEntry";
import { getData } from "@/utils/nukstorage";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function GetPage() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  const fetchData = async () => {
    try {
      const review = await getData(id);

      if (review) {
        setTitle(review.title || "");
        setArtist(review.artist || "");
        setRating(String(review.rating ?? ""));
        setComments(review.comments || "");
      } else {
        alert("No review found for this ID.");
        setTitle("");
        setArtist("");
        setRating("");
        setComments("");
      }
    } catch (err) {
      alert("Error fetching data: " + err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Get Review Data</Text>

      {/* --- Input fields for IDs --- */}
      <View style={{ width: "70%" }}>
        <Text>ID</Text>
        <SingleLineEntry
          placeholder="Enter review ID"
          value={id}
          onChangeText={setId}
        />
      </View>

      {/* --- Fetch button --- */}
      <Pressable
        onPress={fetchData}
        style={{
          backgroundColor: "gray",
          height: 35,
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Fetch Review</Text>
      </Pressable>

      {/* --- Display fetched review --- */}
      <View style={{ width: "70%", marginTop: 20 }}>
        <Text style={{ fontWeight: "bold" }}>Title:</Text>
        <SingleLineEntry
          value={title}
          onChangeText={setTitle}
          placeholder=""
        />

        <Text style={{ fontWeight: "bold" }}>Artist:</Text>
        <SingleLineEntry
          value={artist}
          onChangeText={setArtist}
          placeholder=""
        />

        <Text style={{ fontWeight: "bold" }}>Rating:</Text>
        <SingleLineEntry
          value={rating}
          onChangeText={setRating}
          placeholder=""
        />

        <Text style={{ fontWeight: "bold" }}>Comments:</Text>
        <SingleLineEntry
          value={comments}
          onChangeText={setComments}
          placeholder=""
        />
      </View>

      {/* --- Navigation --- */}
      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: "gray",
          height: 35,
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Back</Text>
      </Pressable>
    </View>
  );
}
