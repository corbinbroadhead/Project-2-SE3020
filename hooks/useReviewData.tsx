import { getData, updateData } from "@/utils/nukstorage";
import { useEffect, useState } from "react";

export function useReviewData(id?: string) {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("3");
  const [artist, setArtist] = useState("");
  const [comments, setComments] = useState("");
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await getData(id);
      if (data) {
        setTitle(data.title || "");
        setRating(data.rating || "3");
        setArtist(data.artist || "");
        setComments(data.comments || "");
        setAlbumCover(data.albumCover || null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const save = async () => {
    const date = new Date();
    const data = { id, title, rating, artist, comments, date, albumCover, type: "album" };
    await updateData(data);
    return data;
  };

  return {
    loading,
    title,
    rating,
    artist,
    comments,
    albumCover,
    setTitle,
    setRating,
    setArtist,
    setComments,
    setAlbumCover,
    save,
  };
}
