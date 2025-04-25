import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RootLayout from "../../../layouts/RootLayout.jsx";

const ServicePackUpgradeExample = () => {
  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.headingContainer}>
              <Ionicons name="arrow-up" size={24} color="#38B2AC" />
              <Text style={styles.heading}>
                Hướng dẫn cách quy đổi ngày nâng cấp gói dịch vụ
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Khi nâng cấp gói, hệ thống sẽ tự động chuyển đổi thời gian còn lại
              từ gói cũ sang gói mới theo{" "}
              <Text style={styles.bold}>tỷ lệ trọng số</Text>.
            </Text>

            <Text style={styles.subheading}>
              💎 Tỷ lệ quy đổi giữa các gói:
            </Text>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.tableCell,
                    { flex: 2 },
                  ]}
                >
                  Gói dịch vụ
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.tableCell,
                    { flex: 2 },
                  ]}
                >
                  Tên tiếng Việt
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.tableCell,
                    { flex: 1 },
                  ]}
                >
                  Trọng số
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Bronze</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Đồng</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>1.0</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Silver</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Bạc</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>1.75</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Gold</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Vàng</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>2.5</Text>
              </View>
            </View>

            <Text style={styles.subheading}>📘 Ví dụ minh hoạ:</Text>
            <Text style={styles.text}>
              ➤ Bạn còn <Text style={styles.bold}>10 ngày</Text> ở gói{" "}
              <Text style={styles.bold}>Đồng</Text> (trọng số 1.0). Nếu bạn nâng
              lên gói <Text style={styles.bold}>Bạc</Text> (trọng số 1.75), thì
              thời gian còn lại sẽ được chuyển thành:
            </Text>
            <Text style={styles.formula}>
              → 10 * 1.0 / 1.75 = <Text style={styles.bold}>5.7 ngày</Text>
            </Text>

            <Text style={styles.text}>
              ➤ Sau đó, hệ thống cộng thêm thời gian sử dụng mới tương ứng với
              gói bạn vừa mua (theo số tháng của gói).
            </Text>

            <Text style={styles.subheading}>⚠️ Lưu ý:</Text>
            <Text style={styles.warningText}>
              ✘ Bạn không thể hạ cấp xuống gói thấp hơn nếu gói hiện tại vẫn còn
              hiệu lực.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.noteText}>
              ⏳ Nếu gói cũ đã hết hạn hoặc bạn chưa từng mua gói nào, hệ thống
              sẽ bắt đầu thời hạn mới từ ngày hiện tại.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.headingContainer}>
              <Ionicons name="calculator" size={24} color="#38B2AC" />
              <Text style={styles.subheading}>
                Ví dụ cụ thể: Nâng cấp từ gói Đồng → Bạc
              </Text>
            </View>

            <Text style={styles.text}>
              Bạn đang sử dụng gói <Text style={styles.bold}>Đồng</Text> từ{" "}
              <Text style={styles.bold}>01/01/2025</Text> đến{" "}
              <Text style={styles.bold}>01/02/2025</Text>.
            </Text>

            <Text style={styles.text}>
              Vào ngày <Text style={styles.bold}>15/01/2025</Text>, bạn nâng cấp
              lên gói <Text style={styles.bold}>Bạc</Text> trong vòng{" "}
              <Text style={styles.bold}>1 tháng</Text>.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.subheading}>🧮 Quy đổi thời gian còn lại:</Text>
            <View style={styles.listItem}>
              <Ionicons
                name="time-outline"
                size={18}
                color="#4299E1"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Thời gian còn lại của gói <Text style={styles.bold}>Đồng</Text>:{" "}
                <Text style={styles.bold}>17 ngày</Text>
              </Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons
                name="time-outline"
                size={18}
                color="#4299E1"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Trọng số quy đổi: Đồng = 1.0, Bạc = 1.75
              </Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons
                name="time-outline"
                size={18}
                color="#4299E1"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Số ngày sau quy đổi:{" "}
                <Text style={styles.bold}>(17 × 1.0) / 1.75 = ~10 ngày</Text>
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.subheading}>📅 Kết quả:</Text>
            <View style={styles.listItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#48BB78"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Gói mới: <Text style={styles.bold}>Bạc</Text>
              </Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#48BB78"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Ngày bắt đầu mới: <Text style={styles.bold}>15/01/2025</Text>
              </Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#48BB78"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Tổng thời hạn:{" "}
                <Text style={styles.bold}>1 tháng + 10 ngày = 40 ngày</Text>
              </Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#48BB78"
                style={styles.listIcon}
              />
              <Text style={styles.listText}>
                Ngày hết hạn mới: <Text style={styles.bold}>24/02/2025</Text>
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.noteText}>
              ⚠️ Bạn không thể hạ cấp xuống gói thấp hơn khi gói hiện tại vẫn
              còn hiệu lực.
            </Text>
          </View>
        </View>
      </ScrollView>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    flex: 1,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  tableContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    paddingVertical: 8,
  },
  tableHeaderCell: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 8,
  },
  tableCell: {
    paddingHorizontal: 8,
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  formula: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 16,
    marginLeft: 16,
  },
  warningText: {
    fontSize: 14,
    color: "#E53E3E",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  noteText: {
    fontSize: 14,
    color: "#718096",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 14,
  },
});

export default ServicePackUpgradeExample;
