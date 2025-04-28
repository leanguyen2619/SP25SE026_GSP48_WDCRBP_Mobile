import { View, Text, StyleSheet } from "react-native";
import { formatDateTimeString, formatPrice } from "../../../../utils/utils";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function RefundTransactionCard({ complaintItem }) {
  return (
    <>
      {(complaintItem.refundAmount > 0 ||
        complaintItem.refundCreditTransaction ||
        complaintItem.refundDebitTransaction) && (
        <View style={styles.container}>
          <Text style={styles.heading}>Thông tin hoàn tiền</Text>

          {/* Refund Percent */}
          <View style={styles.infoRow}>
            <Text style={styles.boldText}>
              Phần trăm hoàn trả (trên tổng giá trị đơn hàng):
            </Text>
            <Text style={styles.greenText}>{complaintItem.refundPercent}%</Text>
          </View>

          {/* Refund Amount */}
          <View style={styles.infoRow}>
            <Text style={styles.boldText}>Số tiền hoàn trả:</Text>
            <Text style={styles.greenText}>
              {formatPrice(complaintItem.refundAmount)}
            </Text>
          </View>

          {/* Refund Credit Transaction */}
          {complaintItem.refundCreditTransaction && (
            <View style={styles.creditTransactionCard}>
              <View style={styles.transactionHeader}>
                <Feather
                  name="arrow-down"
                  size={16}
                  color="#48BB78"
                  style={styles.icon}
                />
                <Text style={styles.greenHeaderText}>
                  Giao dịch nhận tiền hoàn lại cho khách hàng
                </Text>
              </View>
              <View style={styles.transactionGrid}>
                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Mã giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    #{complaintItem.refundCreditTransaction.transactionId}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Loại giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    {complaintItem.refundCreditTransaction.transactionType}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Số tiền:</Text>
                  <Text style={styles.greenAmount}>
                    {formatPrice(complaintItem.refundCreditTransaction.amount)}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Ngày giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    {formatDateTimeString(
                      new Date(complaintItem.refundCreditTransaction.createdAt)
                    )}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Mô tả:</Text>
                  <Text style={styles.description}>
                    {complaintItem.refundCreditTransaction.description}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Refund Debit Transaction */}
          {complaintItem.refundDebitTransaction && (
            <View style={styles.debitTransactionCard}>
              <View style={styles.transactionHeader}>
                <Feather
                  name="arrow-up"
                  size={16}
                  color="#E53E3E"
                  style={styles.icon}
                />
                <Text style={styles.redHeaderText}>
                  Giao dịch hoàn tiền cho khách hàng từ xưởng mộc
                </Text>
              </View>
              <View style={styles.transactionGrid}>
                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Mã giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    #{complaintItem.refundDebitTransaction.transactionId}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Loại giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    {complaintItem.refundDebitTransaction.transactionType}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Số tiền:</Text>
                  <Text style={styles.redAmount}>
                    {formatPrice(complaintItem.refundDebitTransaction.amount)}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Ngày giao dịch:</Text>
                  <Text style={styles.gridValue}>
                    {formatDateTimeString(
                      new Date(complaintItem.refundDebitTransaction.createdAt)
                    )}
                  </Text>
                </View>

                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Mô tả:</Text>
                  <Text style={styles.description}>
                    {complaintItem.refundDebitTransaction.description}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F0FFF4",
    borderRadius: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  greenText: {
    fontWeight: "bold",
    color: "#48BB78",
  },
  creditTransactionCard: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#9AE6B4",
  },
  debitTransactionCard: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FBD38D",
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  greenHeaderText: {
    fontWeight: "bold",
    color: "#2F855A",
    flex: 1,
  },
  redHeaderText: {
    fontWeight: "bold",
    color: "#C53030",
    flex: 1,
  },
  transactionGrid: {
    marginTop: 5,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  gridLabel: {
    fontWeight: "600",
    width: 140,
  },
  gridValue: {
    flex: 1,
  },
  greenAmount: {
    color: "#48BB78",
    fontWeight: "bold",
  },
  redAmount: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
  description: {
    fontSize: 13,
    flex: 1,
  },
});
