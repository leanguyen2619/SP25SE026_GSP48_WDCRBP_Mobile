import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../config/appconfig";

const WoodworkerGuideStep = ({ icon, title, description, steps }) => {
  return (
    <View style={styles.guideStepContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={appColorTheme.brown_2} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      {steps.map((step, idx) => (
        <View key={idx} style={styles.stepContainer}>
          <Icon
            name="check"
            size={16}
            color={appColorTheme.brown_2}
            style={styles.checkIcon}
          />
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
};

export default function PublicWWGuide() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Công khai xưởng trên nền tảng</Text>

      <View style={styles.mainContainer}>
        <Text style={styles.sectionTitle}>
          Hướng dẫn công khai xưởng mộc để cung cấp dịch vụ trên nền tảng
        </Text>

        <TouchableOpacity
          style={[
            styles.accordionButton,
            expanded && styles.accordionButtonExpanded,
          ]}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.accordionButtonText}>
            Các bước để công khai xưởng mộc
          </Text>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={appColorTheme.brown_2}
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.accordionContent}>
            <WoodworkerGuideStep
              icon="tool"
              title="1. Kích hoạt gói dịch vụ"
              description="Để công khai xưởng mộc của bạn, trước tiên cần kích hoạt gói dịch vụ phù hợp."
              steps={[
                "Click vào biểu tượng avatar trên góc phải màn hình",
                'Chọn "Quản lý thông tin"',
                'Chọn "Hồ sơ" trên thanh menu bên góc trái màn hình',
                "Mua gói dịch vụ",
              ]}
            />

            <WoodworkerGuideStep
              icon="dollar-sign"
              title="2. Đảm bảo số dư trong ví"
              description="Để đảm bảo hoạt động cung cấp dịch vụ, trong ví của bạn cần có đủ số dư."
              steps={[
                "Trong ví phải có ít nhất 10 triệu đồng",
                "Click vào biểu tượng avatar trên góc phải màn hình",
                'Chọn "Quản lý thông tin"',
                'Chọn "Ví" trên thanh menu bên góc trái màn hình',
                'Chọn "nạp tiền"',
              ]}
            />

            <WoodworkerGuideStep
              icon="shield"
              title="3. Cập nhật chính sách bảo hành"
              description="Thiết lập chính sách bảo hành rõ ràng sẽ giúp tăng độ tin cậy với khách hàng."
              steps={[
                "Click vào biểu tượng avatar trên góc phải màn hình",
                'Chọn "Quản lý thông tin"',
                'Chọn "BH / Sửa chữa" trên thanh menu bên góc trái màn hình',
                'Chọn "quản lý lỗi bảo hành"',
              ]}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("WoodworkerProfile")}
            >
              <Text style={styles.buttonText}>Đi đến trang hồ sơ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 16,
    padding: 16,
  },
  mainContainer: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: appColorTheme.brown_1,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  accordionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  accordionButtonExpanded: {
    backgroundColor: appColorTheme.brown_1 + "50",
  },
  accordionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  accordionContent: {
    paddingVertical: 16,
  },
  guideStepContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: appColorTheme.brown_1 + "50",
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  stepText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: appColorTheme.brown_2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
