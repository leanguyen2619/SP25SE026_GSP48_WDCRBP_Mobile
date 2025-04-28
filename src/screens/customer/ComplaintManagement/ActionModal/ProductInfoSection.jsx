import { View, Text, StyleSheet } from "react-native";
import PersonalizationProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/PersonalizationProductList";
import CustomizationProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/CustomizationProductList";
import SaleProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/SaleProductList";

export default function ProductInfoSection({ orderDetail, serviceName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin sản phẩm</Text>
      {serviceName && (
        <>
          {serviceName === "Personalization" && (
            <PersonalizationProductList
              orderId={orderDetail?.orderId}
              products={orderDetail?.requestedProduct}
              totalAmount={orderDetail?.totalAmount}
            />
          )}

          {serviceName === "Customization" && (
            <CustomizationProductList
              shipFee={orderDetail?.shipFee}
              products={orderDetail?.requestedProduct}
              totalAmount={orderDetail?.totalAmount}
            />
          )}

          {serviceName === "Sale" && (
            <SaleProductList
              shipFee={orderDetail?.shipFee}
              products={orderDetail?.requestedProduct}
              totalAmount={orderDetail?.totalAmount}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
