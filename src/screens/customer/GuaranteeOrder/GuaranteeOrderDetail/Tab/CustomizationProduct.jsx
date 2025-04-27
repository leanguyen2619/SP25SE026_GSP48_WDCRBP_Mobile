import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { format, add } from "date-fns";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConfigurationItem = ({ name, value }) => (
  <View style={styles.configItem}>
    <Text style={styles.configLabel}>{name}:</Text>
    <Text style={styles.configValue}>{value}</Text>
  </View>
);

export default function CustomizationProduct({
  product = {},
  productCurrentStatus = "",
  currentProductImgUrls = "",
  completionDate = null,
  warrantyDuration = 0,
  isGuarantee,
  guaranteeError,
}) {
  const designDetail = product.designIdeaVariantDetail;

  // Calculate warranty end date if completionDate exists
  const warrantyEndDate = completionDate
    ? add(new Date(completionDate), { months: warrantyDuration })
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Image
              source={{ uri: designDetail?.img_urls?.split(";")[0] || "" }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.productTitle}>
                  #{product.requestedProductId}
                  {". "}
                  {designDetail?.name || "Sản phẩm không xác định"} x{" "}
                  {product?.quantity}
                </Text>
              </TouchableOpacity>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {designDetail?.category?.categoryName || "Không phân loại"}
                </Text>
              </View>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
        </View>

        <View style={styles.productContent}>
          {/* Finish Images if available */}
          {product?.finishImgUrls && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ảnh hoàn thành sản phẩm:</Text>
              <ImageListSelector
                imgUrls={product.finishImgUrls}
                imgH={200}
              />
            </View>
          )}

          {/* Cấu hình đã chọn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cấu hình đã chọn:</Text>
            <View style={styles.configList}>
              {designDetail?.designIdeaVariantConfig?.map(
                (config, index) => {
                  const configSpec =
                    config.designVariantValues[0]?.designIdeaConfig
                      ?.specifications;
                  const configValue = config.designVariantValues[0]?.value;

                  return (
                    <ConfigurationItem
                      key={index}
                      name={configSpec || `Cấu hình ${index + 1}`}
                      value={configValue || "Không xác định"}
                    />
                  );
                }
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Thông tin sửa chữa */}
      <View style={styles.repairInfo}>
        <Text style={styles.repairTitle}>Thông tin sửa chữa:</Text>

        <View style={styles.repairContent}>
          {/* Form */}
          <View style={styles.repairItem}>
            <Text style={styles.repairLabel}>Hình thức yêu cầu:</Text>
            <Text style={styles.repairValue}>
              {isGuarantee ? "Bảo hành" : "Sửa chữa"}
            </Text>
          </View>

          {guaranteeError && isGuarantee && (
            <View style={styles.repairItem}>
              <Text style={styles.errorLabel}>Lỗi bảo hành:</Text>
              <Text style={styles.errorValue}>{guaranteeError}</Text>
            </View>
          )}

          {/* Current Status */}
          <View style={styles.repairItem}>
            <Text style={styles.repairLabel}>Trạng thái hiện tại:</Text>
            <Text style={styles.repairValue}>
              {productCurrentStatus || "Chưa có thông tin"}
            </Text>
          </View>

          {/* Completion Date */}
          {completionDate && (
            <View style={styles.repairItem}>
              <Text style={styles.repairLabel}>Ngày khách nhận hàng:</Text>
              <Text style={styles.repairValue}>
                {format(new Date(completionDate), "dd/MM/yyyy")}
              </Text>
            </View>
          )}

          {/* Warranty Information */}
          {warrantyEndDate && (
            <View style={styles.repairItem}>
              <Text style={styles.repairLabel}>Bảo hành đến:</Text>
              <Text style={styles.repairValue}>
                {format(warrantyEndDate, "dd/MM/yyyy")}
              </Text>
            </View>
          )}

          {/* Current Product Images */}
          {currentProductImgUrls && (
            <View style={styles.section}>
              <Text style={styles.repairLabel}>
                Hình ảnh tình trạng hiện tại:
              </Text>
              <ImageListSelector imgUrls={currentProductImgUrls} imgH={200} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
  },
  categoryBadge: {
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    color: '#6b46c1',
    fontSize: 12,
  },
  productContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
    marginBottom: 8,
  },
  configList: {
    gap: 8,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontWeight: 'bold',
  },
  configValue: {
    flex: 1,
    textAlign: 'right',
  },
  repairInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
  },
  repairTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
    marginBottom: 12,
  },
  repairContent: {
    gap: 8,
  },
  repairItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repairLabel: {
    fontWeight: 'bold',
  },
  repairValue: {
    flex: 1,
    textAlign: 'right',
  },
  errorLabel: {
    fontWeight: 'bold',
    color: 'red',
  },
  errorValue: {
    color: 'red',
    flex: 1,
    textAlign: 'right',
  },
});
