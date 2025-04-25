import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "../../../../../../components/Utility/Pagination";
import PackageFrame from "../../../../../../components/Utility/PackageFrame";
import StarReview from "../../../../../../components/Utility/StarReview";

const numColumns = 1;

export default function DesignList({ designs = [] }) {
  const navigation = useNavigation();

  if (!designs.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy thiết kế nào</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("DesignDetail", { id: item.designIdeaId })
      }
    >
      <PackageFrame packageType={item.woodworkerProfile?.servicePack?.name}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.img_urls ? item.img_urls.split(";")[0] : "" }}
              style={styles.image}
              resizeMode="cover"
            />

            {item.img_urls && item.img_urls.includes(";") && (
              <View style={styles.imageBadge}>
                <Ionicons
                  name="images"
                  size={14}
                  color="white"
                  style={styles.badgeIcon}
                />
                <Text style={styles.badgeText}>
                  {item.img_urls.split(";").length}
                </Text>
              </View>
            )}

            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {item.category.categoryName}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.designName} numberOfLines={1}>
                {item.name}
              </Text>

              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>

            <View style={styles.ratingContainer}>
              <StarReview
                totalStar={item.totalStar}
                totalReviews={item.totalReviews}
              />
            </View>
          </View>
        </View>
      </PackageFrame>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Pagination
        itemsPerPage={8}
        dataList={designs}
        DisplayComponent={({ data }) => (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.designIdeaId.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.listContainer}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#4A5568",
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    height: 280,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
  },
  imageBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(49, 151, 149, 0.8)",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(159, 122, 234, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryText: {
    color: "white",
    fontSize: 10,
  },
  infoContainer: {
    padding: 8,
    height: 130,
    justifyContent: "space-between",
  },
  designName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#718096",
  },
  ratingContainer: {
    alignItems: "flex-end",
    marginTop: "auto",
  },
});
