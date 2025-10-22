import { getData, updateData } from "@/utils/nukstorage";
import { useEffect, useState } from "react";

export function useArtistData(id?: string) {
  const [rating, setRating] = useState("3");
  const [comments, setComments] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await getData(id);
      if (data) {
        setRating(data.rating || "5");
        setComments(data.comments || "");
        setImage(data.image || null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const save = async () => {
    const data = { id, rating, comments, image, type: "artist" };
    await updateData(data);
    return data;
  };

  return {
    loading,
    rating,
    comments,
    image,
    setRating,
    setComments,
    setImage,
    save,
  };
}
