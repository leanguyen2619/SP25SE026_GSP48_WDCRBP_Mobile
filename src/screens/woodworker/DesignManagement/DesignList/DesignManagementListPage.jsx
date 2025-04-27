import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig.js";
import DesignCreateModal from "../ActionModal/DesignCreateModal.jsx";
import DesignDetailModal from "../ActionModal/DesignDetailModal.jsx";
import DesignUpdateModal from "../ActionModal/DesignUpdateModal.jsx";
import DesignDeleteModal from "../ActionModal/DesignDeleteModal.jsx";
import { useGetAllDesignIdeasByWoodworkerQuery } from "../../../../services/designIdeaApi";
import useAuth from "../../../../hooks/useAuth.js";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout.jsx";

export default function DesignManagementListPage() {
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;
  const [searchText, setSearchText] = useState("");

  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useGetAllDesignIdeasByWoodworkerQuery(woodworkerId);

  const rowData = useMemo(() => {
    const sortedData = [...(apiData?.data || [])].sort(
      (a, b) => b.designIdeaId - a.designIdeaId
    );

    if (!searchText.trim()) return sortedData;

    return sortedData.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [apiData, searchText]);

  const renderItem = ({ item }) => (
    <View style={styles.rowItem}>
      <View style={styles.rowContent}>
        <View style={styles.rowField}>
          <Text style={styles.fieldTitle}>Mã thiết kế:</Text>
          <Text style={styles.fieldValue}>{item.designIdeaId}</Text>
        </View>
        <View style={styles.rowField}>
          <Text style={styles.fieldTitle}>Tên thiết kế:</Text>
          <Text style={styles.fieldValue}>{item.name}</Text>
        </View>
        <View style={styles.rowField}>
          <Text style={styles.fieldTitle}>Mô tả:</Text>
          <Text style={styles.fieldValue}>{item.description}</Text>
        </View>
        <View style={styles.rowField}>
          <Text style={styles.fieldTitle}>Danh mục:</Text>
          <Text style={styles.fieldValue}>
            {item?.category?.categoryName || "N/A"}
          </Text>
        </View>
        <View style={styles.rowField}>
          <Text style={styles.fieldTitle}>Cần lắp đặt:</Text>
          <Text style={styles.fieldValue}>
            {item.isInstall ? "Có" : "Không"}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <DesignDetailModal data={item} refetch={refetch} />
        <DesignUpdateModal design={item} refetch={refetch} />
        <DesignDeleteModal design={item} refetch={refetch} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error loading designs: {error.message || "Unknown error"}
        </Text>
      </View>
    );
  }

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản lý Ý tưởng thiết kế</Text>
          <DesignCreateModal refetch={refetch} />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên thiết kế..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={rowData}
          renderItem={renderItem}
          keyExtractor={(item) => item.designIdeaId.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContainer: {
    paddingBottom: 20,
  },
  rowItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  rowContent: {
    marginBottom: 10,
  },
  rowField: {
    flexDirection: "row",
    marginBottom: 5,
  },
  fieldTitle: {
    fontWeight: "bold",
    marginRight: 5,
    minWidth: 100,
  },
  fieldValue: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
});
