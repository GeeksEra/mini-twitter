import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from "react-native";
import { addDoc, collection, getDocs, query, orderBy, startAfter, limit } from "firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';

import { auth, firestore } from "../config";
import { Colors } from "../config";

interface Tweet {
  id: string;
  content: string;
  userName: string;
  datePosted: Date;
}

export const HomeScreen: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTweetContent, setNewTweetContent] = useState<string>("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [lastVisible, setLastVisible] = useState<any>(null); // Adjust type as per your document structure
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchTweets = async (fetchMore = false) => {
    try {
      setLoading(true);
      const tweetsCollectionRef = collection(firestore, "tweets");
      let tweetsQuery = query(tweetsCollectionRef, orderBy("datePosted"), limit(10));

      if (fetchMore && lastVisible) {
        tweetsQuery = query(tweetsCollectionRef, orderBy("datePosted"), startAfter(lastVisible), limit(10));
      }

      const tweetsQuerySnapshot = await getDocs(tweetsQuery);
      const fetchedTweets: Tweet[] = tweetsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datePosted: doc.data().datePosted.toDate()
      }));

      if (fetchMore) {
        setTweets(prevTweets => [...prevTweets, ...fetchedTweets]);
      } else {
        setTweets(fetchedTweets);
      }

      if (tweetsQuerySnapshot.docs.length > 9) {
        setLastVisible(tweetsQuerySnapshot.docs[tweetsQuerySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }

    } catch (error) {
      console.error("Error fetching tweets: ", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleAddTweet = async () => {
    if (newTweetContent.trim() === "") {
      return;
    }

    const tweetData = {
      content: newTweetContent,
      userName: auth.currentUser.email,
      datePosted: new Date()
    };

    try {
      const docRef = await addDoc(collection(firestore, "tweets"), tweetData);
      console.log("Tweet added with ID: ", docRef.id);

      setTweets(prevTweets => [{ id: docRef.id, ...tweetData }, ...prevTweets]);

      setNewTweetContent("");
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Error adding tweet: ", error);
    }
  };

  const loadMoreTweets = () => {
    if (!loadingMore && lastVisible) {
      setLoadingMore(true);
      fetchTweets(true);
    }
  };

  const renderFooter = () => {
    if (!lastVisible) return null;
    if (loading) {
      return <ActivityIndicator size="large" color={Colors.blue} />;
    }
    return null; // Add return null if neither condition is met
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        data={tweets}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.tweetContent}>{item.content}</Text>
            <Text style={styles.tweetMeta}>
              Posted by {item.userName} on {item.datePosted.toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreTweets}
        onEndReachedThreshold={0.5}
      />

      <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()} style={[styles.tweetButton, { backgroundColor: Colors.blue }]}>
        <Text style={styles.tweetButtonText}>Add Tweet</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['1%', '50%']}
        backgroundComponent={null}
        enablePanDownToClose={true}
        index={0}
        animateOnMount={false}
        style={styles.bottomSheetContainer}
      >
        <View style={styles.bottomSheetContent}>
          <TextInput
            placeholder="What's on your mind?"
            value={newTweetContent}
            onChangeText={setNewTweetContent}
            multiline={true}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleAddTweet} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Tweet</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: Colors.lightGray,
  },
  flatList: {
    flex: 1,
    marginBottom: 75,
  },
  tweetButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.blue,
    zIndex: 0,
  },
  tweetButtonText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 0,
  },
  tweetContent: {
    fontSize: 16,
  },
  tweetMeta: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: 5,
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  bottomSheetContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.mediumGray,
  },
  input: {
    marginBottom: 10,
    paddingTop: 15,
    padding: 10,
    backgroundColor: Colors.lightGray, // Adjust background color if needed
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 5,
    minHeight: 100, // Minimum height for multiline input
  },
  addButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
  },
  loadMoreButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
  loadMoreButtonText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: "center",
  },
});
