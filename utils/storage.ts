import AsyncStorage from '@react-native-async-storage/async-storage';

/*
JS {name: "John"}
JSON {"name":"John"}

USER
{
  "id": 10940134,
  "image": "imgimg",
  "username": "nuk",
  "albumreviews": [209310, 41893, 295239],
  "artistreviews": [4723483, 5082304]
}

ALBUM REVIEW
{
  "id": 209310,
  "cover": "imgimg",
  "title": "Sempiternal",
  "rating": 4.5,
  "comments": "This album is fantastic, 'Can You Fe...",
  "user": 10940134,
  "artist": 4723483,
  "date": 1760717641
}

ARTIST REVIEW
{
  "id": 4723483,
  "image": "imgimg",
  "name": "Bring Me The Horizon",
  "rating": 5,
  "comments": "I saw BMTH in concert at the Maverik Cen...",
  "albums": [209310, 295239],
  "user": 10940134
}
*/

///
/// STORAGE
///
export const saveData = async (data: any) => {
  const id = String(data.id);
  try {
    await AsyncStorage.setItem(id, JSON.stringify(data));
    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const getData = async (id: string) => {
  try {
    const json_data = await AsyncStorage.getItem(String(id));
    if (json_data != null) {
      return JSON.parse(json_data);
    }
    return null;
  } catch (err) {
    alert(err);
    return null;
  }
};

export const removeData = async (id: string) => {
  try {
    await AsyncStorage.removeItem(String(id));
    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

///
/// HELPERS
///

// Sort reviews by rating (best → worst or worst → best)
export const getReviewsByRating = async (id: string, order: "asc" | "desc" = "desc") => {
  const user = await getData(String(id));
  const user_reviews = user?.albumreviews || [];
  const reviews: any[] = [];

  for (let i = 0; i < user_reviews.length; i++) {
    const review = await getData(String(user_reviews[i]));
    if (review) reviews.push(review);
  }

  reviews.sort((a, b) =>
    order === "asc" ? a.rating - b.rating : b.rating - a.rating
  );

  return reviews;
};

export const getArtistsByRating = async (id: string, order: "asc" | "desc" = "desc") => {
  const user = await getData(String(id));
  const user_artists = user?.artistreviews || [];
  const artists: any[] = [];

  for (let i = 0; i < user_artists.length; i++) {
    const artist = await getData(String(user_artists[i]));
    if (artist) artists.push(artist);
  }

  artists.sort((a, b) =>
    order === "asc" ? a.rating - b.rating : b.rating - a.rating
  );

  return artists;
};

export const getReviewsByArtist = async (id: string) => {
  const artist = await getData(String(id));
  const artist_reviews = artist?.albums || [];
  const reviews: any[] = [];

  for (let i = 0; i < artist_reviews.length; i++) {
    const review = await getData(String(artist_reviews[i]));
    if (review) reviews.push(review);
  }

  reviews.sort((a, b) => b.rating - a.rating);
  return reviews;
};

export const getAllReviews = async (id: string) => {
  const user = await getData(String(id));
  const user_reviews = user?.albumreviews || [];
  const reviews: any[] = [];

  for (let i = 0; i < user_reviews.length; i++) {
    const review = await getData(String(user_reviews[i]));
    if (review) reviews.push(review);
  }

  return reviews;
};

// Get user's recent reviews (sorted by timestamp)
export const getRecentReviews = async (id: string, limit = 5) => {
  const reviews = await getAllReviews(id);
  reviews.sort((a, b) => b.date - a.date);
  return reviews.slice(0, limit);
};

// Get top artists based on average rating
export const getTopArtists = async (id: string, limit = 5) => {
  const artists = await getArtistsByRating(id);
  return artists.slice(0, limit);
};

// Get top albums based on average rating
export const getTopAlbums = async (id: string, limit = 5) => {
  const albums = await getReviewsByRating(id);
  return albums.slice(0, limit);
};

// Calculate user's review stats
export const getReviewStats = async (id: string) => {
  const reviews = await getAllReviews(id);
  const total = reviews.length;

  if (total === 0) {
    return {
      total,
      average: 0,
      fiveStars: 0,
      fourHalf: 0,
      four: 0,
      threeHalf: 0,
      three: 0,
      belowThree: 0,
    };
  }

  const counts = {
    fiveStars: reviews.filter((r) => r.rating === 5).length,
    fourHalf: reviews.filter((r) => r.rating === 4.5).length,
    four: reviews.filter((r) => r.rating === 4).length,
    threeHalf: reviews.filter((r) => r.rating === 3.5).length,
    three: reviews.filter((r) => r.rating === 3).length,
    belowThree: reviews.filter((r) => r.rating < 3).length,
  };

  const average =
    reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / total;

  return {
    total,
    average: parseFloat(average.toFixed(2)),
    ...counts,
  };
};
