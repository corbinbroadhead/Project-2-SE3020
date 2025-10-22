import IconButton from "@/components/IconButton";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import { ScrollView } from "react-native";

export default function Index() {
  
  return (
    <ScrollView style={{marginHorizontal: 20}}>
      <IconButton text="Profile" onClick={()=> router.push("/profile")} icon={<Ionicons name="person" size={24} color="white"></Ionicons>}></IconButton>
      <IconButton text="Add an Artist" onClick={()=> router.push("/newArtist")} icon={<MaterialCommunityIcons name="pencil-plus" size={24} color="white" />}></IconButton>
      <IconButton text="Create a Review" onClick={()=> router.push("/newReview")} icon={<FontAwesome name="pencil-square-o" size={24} color="white" />}></IconButton>
    </ScrollView>
  );
}
