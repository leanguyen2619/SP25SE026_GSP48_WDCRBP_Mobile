import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatPrice } from "../../../../utils/utils";
import {
  useGetDesignByIdQuery,
  useGetDesignIdeaVariantQuery,
} from "../../../../services/designIdeaApi";
import StarReview from "../../../../components/Utility/StarReview";

export default function DesignDetailModal({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  const designId = data?.designIdeaId;

  const {
    data: designData,
    isLoading: isDesignLoading,
    error: designError,
  } = useGetDesignByIdQuery(designId, {
    skip: !isOpen,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: variantData,
    isLoading: isVariantLoading,
    error: variantError,
  } = useGetDesignIdeaVariantQuery(designId, {
    skip: !isOpen,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const design = designData?.data;
  const variants = variantData?.data || [];

  // Handle loading and error states
  const isLoading = isDesignLoading || isVariantLoading;
  const hasError = designError || variantError;

  // Extract unique configurations from variants
  const getUniqueConfigs = () => {
    const configMap = new Map();

    variants.forEach((variant) => {
      variant.designIdeaVariantConfig.forEach((config) => {
        config.designVariantValues.forEach((value) => {
          const configId = value.designIdeaConfig.designIdeaConfigId;
          if (!configMap.has(configId)) {
            configMap.set(configId, {
              id: configId,
              name: value.designIdeaConfig.specifications,
              values: new Map(),
            });
          }

          const valueId = value.designIdeaConfigValueId;
          if (!configMap.get(configId).values.has(valueId)) {
            configMap.get(configId).values.set(valueId, {
              id: valueId,
              name: value.value,
            });
          }
        });
      });
    });

    // Convert Maps to arrays for rendering
    return Array.from(configMap.values()).map((config) => ({
      ...config,
      values: Array.from(config.values.values()),
    }));
  };

  const configurations = getUniqueConfigs();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renderVariantRow = ({ item }) => {
    // Tạo mô tả cấu hình dễ đọc từ dữ liệu biến thể
    const configDetails = item.designIdeaVariantConfig
      .map((config) => {
        return config.designVariantValues
          .map((value) => {
            return `${value.designIdeaConfig.specifications}: ${value.value}`;
          })
          .join(", ");
      })
      .join("\n\n");

    return (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>{item.designIdeaVariantId}</Text>
        <Text style={styles.tableCell}>{formatPrice(item.price)}</Text>
        <Text style={styles.tableCell}>{configDetails || "-"}</Text>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.iconButton} onPress={openModal}>
        <Ionicons name="eye-outline" size={18} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={false}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chi tiết thiết kế</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={appColorTheme.brown_2} />
              </View>
            ) : hasError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#f44336" />
                <Text style={styles.errorText}>
                  Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                </Text>
              </View>
            ) : (
              <View style={styles.content}>
                {/* Phần hình ảnh */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
                  <ImageListSelector imgH={300} imgUrls={design?.img_urls} />
                </View>

                {/* Phần thông tin cơ bản */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
                  <View style={styles.card}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Tên thiết kế:</Text>
                      <Text style={styles.infoValue}>{design?.name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Danh mục:</Text>
                      <Text style={styles.infoValue}>
                        {design?.category?.categoryName}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Lắp đặt:</Text>
                      <Text style={styles.infoValue}>
                        {design?.isInstall
                          ? "Cần lắp đặt"
                          : "Không cần lắp đặt"}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Điểm đánh giá:</Text>
                      <StarReview
                        totalReviews={design?.totalReviews}
                        totalStar={design?.totalStar}
                      />
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Mô tả:</Text>
                      <Text style={styles.infoValue}>
                        {design?.description || "Không có mô tả"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Phần cấu hình */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Cấu hình sản phẩm</Text>
                  <View style={styles.card}>
                    {configurations.map((config) => (
                      <View key={config.id} style={styles.configItem}>
                        <Text style={styles.configName}>{config.name}:</Text>
                        <View style={styles.configValues}>
                          {config.values.map((value) => (
                            <View key={value.id} style={styles.configValue}>
                              <Text style={styles.configValueText}>
                                {value.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Phần bảng giá */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Bảng giá theo cấu hình
                  </Text>
                  <View style={styles.card}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Mã biến thể</Text>
                      <Text style={styles.tableHeaderCell}>Giá tiền</Text>
                      <Text style={styles.tableHeaderCell}>Cấu hình</Text>
                    </View>
                    <FlatList
                      data={variants}
                      renderItem={renderVariantRow}
                      keyExtractor={(item) =>
                        item.designIdeaVariantId.toString()
                      }
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 10,
    color: "#f44336",
    flex: 1,
  },
  content: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
  },
  configItem: {
    marginBottom: 15,
  },
  configName: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  configValues: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  configValue: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 8,
  },
  configValueText: {
    color: appColorTheme.brown_2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
});
