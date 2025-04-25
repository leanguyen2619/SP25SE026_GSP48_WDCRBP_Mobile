import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme, service } from "../../../../../../config/appconfig";
import { useGetAvailableServiceByWwIdQuery } from "../../../../../../services/availableServiceApi";
import useAuth from "../../../../../../hooks/useAuth";

export default function AvailableService({
  woodworkerId,
  onServiceAction,
  woodworker,
}) {
  const { auth } = useAuth();
  const wwId = woodworkerId;

  const {
    data: response,
    isLoading,
    error,
  } = useGetAvailableServiceByWwIdQuery(wwId);

  const services = response?.data || [];

  // Split warranty policy by semicolon if available
  const warrantyPolicies = woodworker?.warrantyPolicy
    ? woodworker.warrantyPolicy
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const handleServiceClick = (serviceType) => {
    const serviceConfig = service[serviceType] || {};
    if (serviceConfig && onServiceAction) {
      onServiceAction(
        serviceType,
        serviceConfig.path,
        serviceConfig.action,
        serviceConfig.tabIndex
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không thể tải dịch vụ. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {services.map((availableService) => {
          if (!availableService.operatingStatus || !availableService.status)
            return null;

          const serviceType = availableService.service.serviceName;
          const serviceInfo = service[serviceType] || {};

          return (
            <View
              key={availableService.availableServiceId}
              style={styles.serviceItem}
            >
              <Text style={styles.serviceTitle}>{serviceInfo.serviceName}</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>
                  Mô tả dịch vụ của xưởng:
                </Text>
                <Text style={styles.descriptionText}>
                  {availableService.description}
                </Text>
              </View>
              {auth?.role !== "Woodworker" && (
                <TouchableOpacity
                  style={styles.serviceButton}
                  onPress={() => handleServiceClick(serviceType)}
                >
                  <Text style={styles.serviceButtonText}>
                    {serviceInfo.buttonText || "Đặt dịch vụ"}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="white"
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {warrantyPolicies.length > 0 && (
          <View style={styles.warrantyContainer}>
            <View style={styles.warrantyHeader}>
              <Ionicons
                name="shield-outline"
                size={20}
                color={appColorTheme.brown_2}
                style={styles.warrantyIcon}
              />
              <Text style={styles.warrantyTitle}>
                Chính sách bảo hành (Lỗi chấp nhận bảo hành)
              </Text>
            </View>
            {warrantyPolicies.map((policy, index) => (
              <View key={index} style={styles.policyItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.policyText}>{policy}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorText: {
    color: "#E53E3E",
  },
  serviceItem: {
    marginBottom: 24,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    marginBottom: 4,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
  },
  serviceButton: {
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  serviceButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  warrantyContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  warrantyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  warrantyIcon: {
    marginRight: 8,
  },
  warrantyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  policyItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#718096",
    marginTop: 6,
    marginRight: 8,
  },
  policyText: {
    flex: 1,
  },
});
