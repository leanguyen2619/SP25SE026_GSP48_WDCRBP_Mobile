import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import ImageListSelector from "../../../../../../components/Utility/ImageListSelector";
import RelativeTime from "../../../../../../components/Utility/RelativeTime";
import { useGetWoodworkerPostsQuery } from "../../../../../../services/postApi";
import { appColorTheme } from "../../../../../../config/appconfig";

// Component for expandable text with "Xem thêm"/"Thu gọn" functionality
const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text || text.length < 150) {
    // If text is short enough, just display it
    return <Text style={styles.postText}>{text}</Text>;
  }

  return (
    <View style={styles.expandableContainer}>
      <Text style={styles.postText} numberOfLines={expanded ? undefined : 3}>
        {text}
      </Text>
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? "Thu gọn" : "Xem thêm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function PostTab({ woodworkerId }) {
  const { data, isLoading, isError } = useGetWoodworkerPostsQuery(woodworkerId);
  const posts = data?.data || [];

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>
          Đã xảy ra lỗi khi tải dữ liệu bài viết.
        </Text>
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>
          Xưởng mộc này chưa có bài viết nào.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (
        <View style={styles.postContainer} key={post.postId}>
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>

            <View style={styles.timeContainer}>
              <RelativeTime dateString={post.createdAt} />
            </View>

            <ExpandableText text={post.description} />

            <ImageListSelector imgUrls={post.imgUrls} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  centerContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#F8D7DA",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#F5C6CB",
  },
  alertText: {
    color: "#721C24",
    fontSize: 16,
  },
  postContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  postCard: {
    width: "100%",
    maxWidth: 680,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeContainer: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  postText: {
    marginTop: 16,
    marginBottom: 8,
  },
  expandableContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    color: appColorTheme.brown_2,
    fontWeight: "600",
  },
});
