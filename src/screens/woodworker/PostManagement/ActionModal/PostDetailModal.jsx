import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useState, useRef } from "react";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatDateString } from "../../../../utils/utils";

export default function PostDetailModal({ post }) {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return (
    <>
      <TouchableOpacity style={styles.actionButton} onPress={openModal}>
        <Icon name="eye" size={18} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết bài viết</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <View style={styles.infoGrid}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoRow}>
                      <Text style={styles.boldText}>Mã bài viết:</Text>{" "}
                      {post?.postId}
                    </Text>
                    <Text style={styles.infoRow}>
                      <Text style={styles.boldText}>Tiêu đề:</Text>{" "}
                      {post?.title}
                    </Text>
                    <Text style={styles.infoRow}>
                      <Text style={styles.boldText}>Ngày tạo:</Text>{" "}
                      {post?.createdAt ? formatDateString(post?.createdAt) : ""}
                    </Text>
                    {post?.woodworkerName && (
                      <Text style={styles.infoRow}>
                        <Text style={styles.boldText}>Xưởng mộc:</Text>{" "}
                        {post.woodworkerName}
                      </Text>
                    )}
                  </View>
                  <View style={styles.imageSection}>
                    <ImageListSelector imgH={200} imgUrls={post?.imgUrls} />
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.descriptionLabel}>
                  <Text style={styles.boldText}>Mô tả:</Text>
                </Text>
                <Text style={styles.description}>{post?.description}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 15,
  },
  infoGrid: {
    flexDirection: "column",
  },
  infoSection: {
    marginBottom: 15,
  },
  imageSection: {
    marginVertical: 10,
  },
  infoRow: {
    marginBottom: 8,
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  descriptionLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
  },
});
