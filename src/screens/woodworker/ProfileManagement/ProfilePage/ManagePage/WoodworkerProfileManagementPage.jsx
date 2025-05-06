import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useGetWoodworkerByUserIdQuery } from "../../../../../services/woodworkerApi.js";
import useAuth from "../../../../../hooks/useAuth.js";
import PackManagement from "../Pack/PackManagement.jsx";
import PersonalInformationManagement from "../PersonalInformation/PersonalInformationManagement.jsx";
import WoodworkerInformationManagement from "../WoodworkerInformation/WoodworkerInformationManagement.jsx";
import WoodworkerLayout from "../../../../../layouts/WoodworkerLayout.jsx";
import PublicProfileSwitch from "../../../../../components/Header/PublicProfileSwitch.jsx";

export default function WoodworkerProfileManagementPage() {
  const { auth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetWoodworkerByUserIdQuery(auth?.userId);
  const [address, setAddress] = useState(null);
  const [isAddressUpdate, setIsAddressUpdate] = useState(false);

  const woodworker = response?.data;

  useEffect(() => {
    if (woodworker?.address) {
      const addressParts = woodworker.address.split(", ");
      const street = addressParts[0];
      const wardName = addressParts[1];
      const districtName = addressParts[2];
      const cityName = addressParts[3];

      setAddress({
        street,
        wardName,
        districtName,
        cityName,
        cityId: woodworker.cityId,
        districtId: woodworker.districtId,
        wardCode: woodworker.wardCode,
      });
    }
  }, [woodworker]);

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
        <Text style={styles.errorText}>Đã có lỗi xảy ra khi tải thông tin</Text>
      </View>
    );
  }

  if (!woodworker) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin xưởng mộc</Text>
      </View>
    );
  }

  return (
    <WoodworkerLayout>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <PackManagement
            refetch={refetch}
            woodworker={woodworker}
            refreshData={refetch}
          />

          <View style={styles.switchContainer}>
            <PublicProfileSwitch />
          </View>

          <View style={styles.sectionDivider} />

          <PersonalInformationManagement
            refetch={refetch}
            woodworker={woodworker}
          />

          <View style={styles.sectionDivider} />

          <WoodworkerInformationManagement
            refetch={refetch}
            woodworker={woodworker}
            address={address}
            setAddress={setAddress}
            isAddressUpdate={isAddressUpdate}
            setIsAddressUpdate={setIsAddressUpdate}
          />
        </View>
      </ScrollView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  errorText: {
    fontSize: 16,
    color: "#E53E3E",
    textAlign: "center",
  },
  sectionDivider: {
    height: 16,
  },
});
