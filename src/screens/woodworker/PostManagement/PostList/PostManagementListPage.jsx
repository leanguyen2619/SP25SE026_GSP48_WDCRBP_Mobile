import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import PostCreateModal from "../ActionModal/PostCreateModal";
import PostDetailModal from "../ActionModal/PostDetailModal";
import PostUpdateModal from "../ActionModal/PostUpdateModal";
import PostDeleteModal from "../ActionModal/PostDeleteModal";
import { appColorTheme } from "../../../../config/appconfig";
import { useGetWoodworkerPostsQuery } from "../../../../services/postApi";
import useAuth from "../../../../hooks/useAuth";
import { formatDateTimeString } from "../../../../utils/utils";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";

export default function PostManagementListPage() {
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useGetWoodworkerPostsQuery(
    auth?.wwId
  );

  const posts = useMemo(() => {
    const formattedPosts =
      data?.data?.map((post) => {
        return {
          ...post,
        };
      }) || [];

    // Sort posts by id in descending order
    return formattedPosts.sort((a, b) => b.postId - a.postId);
  }, [data]);

  // Filter posts by title
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Mã bài viết: {item.postId}</Text>
          <Text style={styles.cardDate}>
            {formatDateTimeString(item.createdAt)}
          </Text>
        </View>
        <Text style={styles.cardSubtitle}>Tiêu đề: {item.title}</Text>
      </View>
      <View style={styles.actionButtons}>
        <PostDetailModal post={item} />
        <PostUpdateModal post={item} refetch={refetch} />
        <PostDeleteModal post={item} refetch={refetch} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </View>
    );
  }

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản lý Bài viết</Text>
          <PostCreateModal refetch={refetch} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Không có bài viết nào</Text>
            </View>
          }
        />
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  searchContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  cardSubtitle: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
