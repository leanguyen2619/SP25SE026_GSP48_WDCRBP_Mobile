import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../config/appconfig";
import { useGetContractByServiceOrderIdQuery } from "../../../services/contractApi";
import useAuth from "../../../hooks/useAuth";
import { useRoute, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function ContractPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params?.id;
  const { auth } = useAuth();

  // Fetch contract data
  const {
    data: contractResponse,
    isLoading,
    error,
  } = useGetContractByServiceOrderIdQuery(id);

  // Handle share/export functionality
  const handleShare = async () => {
    try {
      await Share.share({
        message: "Hợp đồng số " + contractResponse?.data?.contractId,
        title: "Chia sẻ hợp đồng",
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ hợp đồng");
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <RootLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        </View>
      </RootLayout>
    );
  }

  // Handle error state
  if (error || !contractResponse?.data) {
    return (
      <RootLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Có lỗi khi tải dữ liệu hợp đồng</Text>
        </View>
      </RootLayout>
    );
  }

  const contract = contractResponse.data;

  // Check authorization
  const isAuthorized =
    auth?.userId === contract?.customer?.userId ||
    auth?.userId === contract?.woodworker?.userId;

  // Redirect if unauthorized
  if (!isAuthorized) {
    navigation.navigate("Unauthorized");
    return null;
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (e) {
      return "";
    }
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + " VNĐ";
  };

  // Get contract sign date parts
  const signDate = contract.signDate ? new Date(contract.signDate) : new Date();
  const day = signDate.getDate();
  const month = signDate.getMonth() + 1;
  const year = signDate.getFullYear();

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Hợp đồng cung ứng dịch vụ</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color="white" />
            <Text style={styles.shareButtonText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contractContainer}>
          {/* Header */}
          <View style={styles.contractHeader}>
            <Text style={styles.textCenter}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Text>
            <Text style={[styles.textCenter, styles.bold]}>
              Độc lập - Tự do - Hạnh phúc
            </Text>
            <Text style={[styles.textCenter, styles.spacer]}>===o0o===</Text>
            <Text style={[styles.textCenter, styles.bold, styles.largeSpacer]}>
              HỢP ĐỒNG CUNG ỨNG DỊCH VỤ
            </Text>
            <Text style={[styles.textCenter, styles.spacer]}>
              Mã Số: <Text style={styles.bold}>{contract.contractId}</Text>
            </Text>
          </View>

          {/* Contract body */}
          <Text style={styles.paragraph}>Bộ luật dân sự 2015;</Text>
          <Text style={styles.paragraph}>Luật thương mại 2005</Text>
          <Text style={styles.paragraph}>
            Căn cứ Luật giao dịch điện tử số 51/2005/QH11 ngày 29/11/2005
          </Text>
          <Text style={styles.paragraph}>
            Hợp Đồng này được ký ngày <Text style={styles.bold}>{day}</Text>{" "}
            tháng <Text style={styles.bold}>{month}</Text> năm{" "}
            <Text style={styles.bold}>{year}</Text> giữa:
          </Text>

          {/* Party A */}
          <Text style={[styles.bold, styles.paragraph]}>
            Bên Cung Cấp Dịch Vụ:{" "}
            <Text>{contract.woodworker?.username || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>
            Điện thoại: <Text>{contract.woodworker?.phone || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>
            Email: <Text>{contract.woodworker?.email || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>
            Đại diện bởi: <Text>{contract.woodworker?.username || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>Sau đây được gọi là "Bên A".</Text>

          {/* Party B */}
          <Text style={[styles.bold, styles.paragraph]}>
            Bên Thuê Dịch Vụ:{" "}
            <Text>
              {contract.customer?.username || contract.cusFullName || ""}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Điện thoại:{" "}
            <Text>{contract.cusPhone || contract.customer?.phone || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>
            Email:{" "}
            <Text>{contract.email || contract.customer?.email || ""}</Text>
          </Text>
          <Text style={styles.paragraph}>
            Đại diện bởi:{" "}
            <Text>
              {contract.customer?.username || contract.cusFullName || ""}
            </Text>
          </Text>
          <Text style={styles.paragraph}>Sau đây được gọi là "Bên B".</Text>

          {/* Service description */}
          <Text style={styles.paragraph}>
            Bên A cam kết sẽ hoàn thành dịch vụ vào ngày{" "}
            <Text style={styles.bold}>{formatDate(contract.completeDate)}</Text>{" "}
            nếu bên B hoàn thành nghĩa vụ thanh toán theo từng giai đoạn với
            tổng số tiền cần phải thanh toán là{" "}
            <Text style={styles.bold}>
              {formatCurrency(contract.contractTotalAmount)}
            </Text>
            .
          </Text>

          {/* Product details */}
          <View style={styles.section}>
            <Text style={[styles.bold, styles.sectionTitle]}>
              Chi tiết sản phẩm:
            </Text>
            <View style={styles.tableContainer}>
              {/* Table header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 3 }]}>
                  Sản phẩm
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                  Số lượng
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                  Bảo hành (tháng)
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                  Thành tiền
                </Text>
              </View>

              {/* Table rows */}
              {contract.requestedProducts?.map((product) => (
                <View key={product.requestedProductId} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 3 }]}>
                    {product.category?.categoryName ||
                      "Sản phẩm không xác định"}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1, textAlign: "center" }]}
                  >
                    {product.quantity}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 2, textAlign: "center" }]}
                  >
                    {product.warrantyDuration || 0}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 2, textAlign: "right" }]}
                  >
                    {formatCurrency(product.totalAmount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Warranty */}
          <Text style={styles.paragraph}>
            Bên A sẽ chịu trách nhiệm bảo hành dịch vụ theo chính sách:
          </Text>
          <Text style={[styles.bold, styles.paragraph]}>
            {contract.warrantyPolicy || "Không có"}
          </Text>

          {/* Woodworker terms */}
          {contract.woodworkerTerms && (
            <View style={styles.section}>
              <Text style={[styles.bold, styles.sectionTitle]}>
                Điều khoản của bên A:
              </Text>
              <Text style={styles.paragraph}>{contract.woodworkerTerms}</Text>
            </View>
          )}

          {/* Platform terms */}
          <View style={styles.section}>
            <Text style={[styles.bold, styles.sectionTitle]}>
              Điều khoản nền tảng:
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Terms")}
              style={styles.termsLink}
            >
              <Text style={styles.linkText}>Xem điều khoản nền tảng</Text>
            </TouchableOpacity>
          </View>

          {/* Signatures */}
          <View style={styles.signatureContainer}>
            <View style={styles.signatureColumn}>
              <Text style={[styles.bold, styles.textCenter]}>
                ĐẠI DIỆN BÊN A
              </Text>
              {contract.woodworkerSignature && (
                <Image
                  source={{ uri: contract.woodworkerSignature }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.textCenter, styles.spacer]}>
                {contract.woodworker?.username || ""}
              </Text>
            </View>

            <View style={styles.signatureColumn}>
              <Text style={[styles.bold, styles.textCenter]}>
                ĐẠI DIỆN BÊN B
              </Text>
              {contract.customerSignature && (
                <Image
                  source={{ uri: contract.customerSignature }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.textCenter, styles.spacer]}>
                {contract.customer?.username || contract.cusFullName || ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  shareButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: "white",
    marginLeft: 4,
  },
  contractContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contractHeader: {
    marginBottom: 20,
  },
  textCenter: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  spacer: {
    marginTop: 10,
  },
  largeSpacer: {
    marginTop: 20,
  },
  paragraph: {
    marginTop: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  termsLink: {
    marginTop: 5,
  },
  linkText: {
    color: "#3182CE",
    textDecorationLine: "underline",
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureColumn: {
    flex: 1,
    alignItems: "center",
  },
  signatureImage: {
    width: 150,
    height: 80,
    marginTop: 10,
  },
});
