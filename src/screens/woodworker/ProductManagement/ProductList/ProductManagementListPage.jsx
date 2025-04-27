import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig";
import ProductCreateModal from "../ActionModal/ProductCreateModal";
import ProductDetailModal from "../ActionModal/ProductDetailModal";
import ProductUpdateModal from "../ActionModal/ProductUpdateModal";
import ProductDeleteModal from "../ActionModal/ProductDeleteModal";
import { formatPrice } from "../../../../utils/utils";
import { useGetProductsByWoodworkerIdQuery } from "../../../../services/productApi";
import useAuth from "../../../../hooks/useAuth";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";

export default function ProductManagementListPage() {
  const { auth } = useAuth();
  const [searchText, setSearchText] = useState("");

  // Fetch products data from API
  const { data, isLoading, isError, refetch } =
    useGetProductsByWoodworkerIdQuery(auth?.wwId, {
      skip: !auth?.wwId,
    });

  const allProducts = data?.data || [];

  // Sort products in descending order by productId
  const sortedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return [...allProducts].sort((a, b) => b.productId - a.productId);
  }, [allProducts]);

  // Filter products by name
  const products = useMemo(() => {
    if (!searchText.trim()) return sortedProducts;
    return sortedProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [sortedProducts, searchText]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Mã SP:</Text>
        <Text style={styles.value}>{item.productId}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Danh mục:</Text>
        <Text style={styles.value}>{item.categoryName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tên sản phẩm:</Text>
        <Text style={styles.value}>{item.productName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>{formatPrice(item.price)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tồn kho:</Text>
        <Text style={styles.value}>{item.stock}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Loại gỗ:</Text>
        <Text style={styles.value}>{item.woodType}</Text>
      </View>

      <View style={styles.actionContainer}>
        <ProductDetailModal product={item} />
        <ProductUpdateModal product={item} refetch={refetch} />
        <ProductDeleteModal product={item} refetch={refetch} />
      </View>
    </View>
  );

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý Sản phẩm</Text>
          <ProductCreateModal refetch={refetch} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên sản phẩm"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 120,
  },
  value: {
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
