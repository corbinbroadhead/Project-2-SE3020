import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/*
JS {name: "John"}
JSON {"name":"John"}

USER
{
  "image": "imgimg",
  "username": "nuk",
  "reviews": []
  "artists": []
  "type": "user"
}

ALBUM REVIEW
{
  "id": 209310,
  "cover": "imgimg",
  "title": "Sempiternal",
  "rating": 4.5,
  "comments": "This album is fantastic, 'Can You Fe...",
  "artist": "Bring Me The Horizon",
  "date": 1760717641
  "type": "album"
}

ARTIST REVIEW
{
  "id": "Bring Me The Horizon",
  "image": "imgimg",
  "rating": 5,
  "comments": "I saw BMTH in concert at the Maverik Cen...",
  "albums": [209310, 295239],
  "type": "artist"
}
*/

///
/// STORAGE
///
export const saveData = async (data: any) => {
  let id = String(data.id);
  if(data.id == "None") {
    id = Crypto.randomUUID();
  }
  try {
    await AsyncStorage.setItem(id, JSON.stringify(data));
    if(data.type == "album") {
        saveReviewToArray(id);
    } else if(data.type == "artist") {
        saveArtistToArray(id);
    }
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

export const saveReviewToArray = async (id: string) => {
  try {
    // 1. Load existing reviews (if any)
    const raw_data = await AsyncStorage.getItem("reviews");
    let review_data: string[] = [];

    // 2. Parse existing data safely
    if (raw_data) {
      review_data = JSON.parse(raw_data);
    }

    // 3. Add new review ID
    review_data.push(id);

    // 4. Save updated data
    await AsyncStorage.setItem("reviews", JSON.stringify(review_data));

    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const removeReviewFromArray = async (id: string) => {
  try {
    // 1. Load existing reviews (if any)
    const raw_data = await AsyncStorage.getItem("reviews");
    let review_data: string[] = [];

    // 2. Parse existing data safely
    if (raw_data) {
      review_data = JSON.parse(raw_data);
    }

    // 3. Remove new review ID
    const new_review_data = review_data.filter(item => item !== id);

    // 4. Save updated data
    await AsyncStorage.setItem("reviews", JSON.stringify(new_review_data));

    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const saveArtistToArray = async (id: string) => {
  try {
    // 1. Load existing reviews (if any)
    const raw_data = await AsyncStorage.getItem("artists");
    let artist_data: string[] = [];
    // 2. Parse existing data safely
    if (raw_data) {
      artist_data = JSON.parse(raw_data);
    }

    // 3. Add new review ID
    artist_data.push(id);

    // 4. Save updated data
    await AsyncStorage.setItem("artists", JSON.stringify(artist_data));

    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const removeArtistFromArray = async (id: string) => {
  try {
    // 1. Load existing artists (if any)
    const raw_data = await AsyncStorage.getItem("artists");
    let artist_data: string[] = [];

    // 2. Parse existing data safely
    if (raw_data) {
      artist_data = JSON.parse(raw_data);
    }

    // 3. Remove new artist ID
    const new_artist_data = artist_data.filter(item => item !== id);

    // 4. Save updated data
    await AsyncStorage.setItem("artists", JSON.stringify(new_artist_data));

    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const removeData = async (id: string) => {
  try {
    const data = await getData(id);
    await AsyncStorage.removeItem(String(id));
    if (data.type == "album") {
        removeReviewFromArray(id)
    } else if (data.type == "artist") {
        removeArtistFromArray(id)
    }
    return true;
  } catch (err) {
    alert(err);
    return false;
  }
};

export const removeAllArtists = async () => {
    // 1. Load existing artists (if any)
    const raw_data = await AsyncStorage.getItem("artists");
    let artist_data: string[] = [];

    // 2. Parse existing data safely
    if (raw_data) {
      artist_data = JSON.parse(raw_data);
    }
    try {
        for(let i = 0; i < artist_data.length; i++) {
            removeArtistFromArray(artist_data[i])
        }
        return true;
    } catch (err) {
        alert(err)
        return false;
    }
}

export const removeAllReviews = async () => {
    // 1. Load existing artists (if any)
    const raw_data = await AsyncStorage.getItem("reviews");
    let review_data: string[] = [];

    // 2. Parse existing data safely
    if (raw_data) {
      review_data = JSON.parse(raw_data);
    }
    try {
        for(let i = 0; i < review_data.length; i++) {
            removeArtistFromArray(review_data[i])
        }
        return true;
    } catch (err) {
        alert(err)
        return false;
    }
}

export const updateData = async (data: any) => {
    try {
        await removeData(data.id)
        await saveData(data)
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
///
/// HELPERS
///

export const getAllReviews = async () => {
    return await getData("reviews")
}

export const getRecentReviews = async (limit = 5) => {
  const reviews = await getData("reviews");
  const review_dict: Record<string, string> = {};
  for (let i = 0; i < reviews.length; i++) {
    const review_data = await getData(reviews[i]);
    if (review_data?.date) {
      review_dict[reviews[i]] = review_data.date;
    }
  }
  reviews.sort(
    (a, b) =>
      new Date(review_dict[b]).getTime() - new Date(review_dict[a]).getTime()
  );
  return reviews.slice(0, limit);
};

export const getAllArtists = async () => {
    return await getData("artists")
}

export const getAllReviewsByArtist = async (id: string) => {
    const reviews = await getData("reviews")
    const artist_reviews = []
    for(let i = 0; i < reviews.length; i++) {
        const review_data = await getData(reviews[i]);
        if(review_data.artist == id) {
            artist_reviews.push(reviews[i])
        }
    }
    artist_reviews.sort((a, b) => b.rating - a.rating)
    return artist_reviews;
}

export const getAllReviewsSorted = async (order: "asc" | "desc" = "desc") => {
  const reviews = await getAllReviews();
  const reviewDict: Record<string, number> = {};
  for (let i = 0; i < reviews.length; i++) {
    const reviewData = await getData(reviews[i]);
    if (reviewData?.rating !== undefined) {
      reviewDict[reviews[i]] = parseFloat(reviewData.rating) || 0;
    } else {
      reviewDict[reviews[i]] = 0;
    }
  }
  reviews.sort((a, b) => {
    const diff = reviewDict[a] - reviewDict[b];
    return order === "asc" ? diff : -diff;
  });
  return reviews;
};

export const getAllArtistsSorted = async (order: "asc" | "desc" = "desc") => {
  const artists = await getAllArtists();
  const artistDict: Record<string, number> = {};
  for (let i = 0; i < artists.length; i++) {
    const artistData = await getData(artists[i]);
    if (artistData?.rating !== undefined) {
      artistDict[artists[i]] = parseFloat(artistData.rating) || 0;
    } else {
      artistDict[artists[i]] = 0;
    }
  }
  artists.sort((a, b) => {
    const diff = artistDict[a] - artistDict[b];
    return order === "asc" ? diff : -diff;
  });
  return artists;
};

export const getAllReviewsSorted_old = async (order: "asc" | "desc" = "desc") => {
    const reviews = await getAllReviews()
    if(order == "asc") {
        reviews.sort((a, b) => a.rating - b.rating)
    } else {
        reviews.sort((a, b) => b.rating - a.rating)
    }
    return reviews;
}

export const getAllArtistsSorted_old = async (order: "asc" | "desc" = "desc") => {
    const artists = await getAllArtists()
    if(order == "asc") {
        artists.sort((a, b) => a.rating - b.rating)
    } else {
        artists.sort((a, b) => b.rating - a.rating)
    }
    return artists;
}

export const getTopAlbums = async (limit=5) => {
    const albums = await getAllReviewsSorted("desc")
    return albums.slice(0, limit);
}

export const getTopArtists = async (limit=5) => {
    const artists = await getAllArtistsSorted("desc")
    return artists.slice(0, limit);
}

// Calculate user's review stats
export const getReviewStats = async () => {
  const reviews = await getAllReviews();
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

//////////
/////////
///////
/////
///
//