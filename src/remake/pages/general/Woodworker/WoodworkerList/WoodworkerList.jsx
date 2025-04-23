import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import StarReview from "../../../../components/Utility/StarReview";
import PackageFrame from "../../../../components/Utility/PackageFrame";
import Pagination from "../../../../components/Utility/Pagination";

const numColumns = 1;

export default function WoodworkerList({ woodworkers = [] }) {
  const navigation = useNavigation();

  if (!woodworkers.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy xưởng mộc nào</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("WoodworkerDetail", { id: item.woodworkerId })
      }
    >
      <PackageFrame packageType={item.servicePack?.name}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.imgUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {item.brandName}
            </Text>

            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color="#718096" />
              <Text style={styles.location} numberOfLines={2}>
                {item.address}
              </Text>
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
        dataList={woodworkers}
        DisplayComponent={({ data }) => (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.woodworkerId.toString()}
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
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  itemContainer: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    height: 240,
  },
  image: {
    width: "100%",
    height: 140,
  },
  infoContainer: {
    padding: 8,
    height: 100,
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  location: {
    fontSize: 12,
    color: "#718096",
    flex: 1,
    marginLeft: 4,
  },
  ratingContainer: {
    alignItems: "flex-end",
    marginTop: "auto",
  },
});
