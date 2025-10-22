import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{title: "Add"}}></Stack.Screen>
    <Stack.Screen name="get" options={{title: "Get"}}></Stack.Screen>
    <Stack.Screen name="profile" options={{title: "Profile"}}></Stack.Screen>
    <Stack.Screen name="review" options={{title: "Review Details"}}></Stack.Screen>
    <Stack.Screen name="artist" options={{title: "Artist Details"}}></Stack.Screen>
    <Stack.Screen name="newReview" options={{title: "New Review"}}></Stack.Screen>
    <Stack.Screen name="newArtist" options={{title: "New Artist"}}></Stack.Screen>
    </Stack>;
}
