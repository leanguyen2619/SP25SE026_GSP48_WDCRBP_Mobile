import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig.js";
import UserAddress from "../Address/UserAddress.jsx";
import { useGetUserInformationQuery } from "../../../../services/authApi.js";
import useAuth from "../../../../hooks/useAuth.js";
import CustomerPersonalInfoForm from "../PersonalInformation/CustomerPersonalInfoForm.jsx";
import CustomerPasswordChangeForm from "../PersonalInformation/CustomerPasswordChangeForm.jsx";

export default function CustomerProfilePage() {
  const { auth } = useAuth();
  const {
    data: userDataResponse,
    isLoading,
    error,
    refetch,
  } = useGetUserInformationQuery(auth?.userId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  const userData = userDataResponse.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <UserAddress />
      </View>

      {/* Thông tin cá nhân */}
      <View style={styles.section}>
        <Text style={styles.heading}>Thông tin cá nhân</Text>

        <View style={styles.card}>
          <CustomerPersonalInfoForm userData={userData} refetch={refetch} />
          <CustomerPasswordChangeForm refetch={refetch} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  heading: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
