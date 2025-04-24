import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Image,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignatureComponent({
  initialSignature,
  onSaveSignature,
  savedSignature,
  isEditable = true,
  title = "Chữ ký",
  showSizeControls = true,
}) {
  const [canvasSize, setCanvasSize] = useState({
    width: 300,
    height: 150,
  });
  const [points, setPoints] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const signatureRef = useRef(null);

  // Tạo PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        setCurrentStroke([newPoint]);
      },
      onPanResponderMove: (event) => {
        if (!isEditable || savedSignature) return;

        const { locationX, locationY } = event.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        setCurrentStroke((prevStroke) => [...prevStroke, newPoint]);
      },
      onPanResponderRelease: () => {
        if (currentStroke.length > 0) {
          setPoints((prevPoints) => [...prevPoints, currentStroke]);
          setCurrentStroke([]);
        }
      },
    })
  ).current;

  // Xóa chữ ký
  const clearSignature = () => {
    setPoints([]);
    setCurrentStroke([]);
  };

  // Lưu chữ ký
  const saveSignature = async () => {
    if (points.length > 0 && signatureRef.current) {
      try {
        const dataURL = await captureRef(signatureRef, {
          format: "png",
          quality: 1,
        });

        // Chuyển đổi URI thành blob
        const response = await fetch(dataURL);
        const blob = await response.blob();

        onSaveSignature(blob, dataURL);
      } catch (error) {
        console.error("Lỗi khi lưu chữ ký:", error);
      }
    }
  };

  // Tăng/giảm kích thước
  const handleSizeChange = (field, amount) => {
    clearSignature();
    setCanvasSize((prev) => ({
      ...prev,
      [field]: Math.max(field === "width" ? 200 : 100, prev[field] + amount),
    }));
  };

  // Render từng nét vẽ
  const renderStrokes = () => {
    return [...points, currentStroke.length > 0 ? currentStroke : null]
      .filter(Boolean)
      .map((stroke, strokeIndex) => (
        <View key={`stroke-${strokeIndex}`}>
          {stroke.map((point, pointIndex) => (
            <Animated.View
              key={`point-${strokeIndex}-${pointIndex}`}
              style={[
                styles.point,
                {
                  left: point.x - 2,
                  top: point.y - 2,
                },
              ]}
            />
          ))}
        </View>
      ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {savedSignature && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Đã lưu</Text>
          </View>
        )}
      </View>

      {isEditable && showSizeControls && (
        <View style={styles.sizeControls}>
          <View style={styles.sizeControl}>
            <Text style={styles.sizeLabel}>Chiều rộng:</Text>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange("width", -50)}
              >
                <Text style={styles.sizeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sizeValue}>{canvasSize.width}px</Text>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange("width", 50)}
              >
                <Text style={styles.sizeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sizeControl}>
            <Text style={styles.sizeLabel}>Chiều cao:</Text>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange("height", -50)}
              >
                <Text style={styles.sizeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sizeValue}>{canvasSize.height}px</Text>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange("height", 50)}
              >
                <Text style={styles.sizeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {isEditable ? (
        <>
          <Text style={styles.instruction}>
            Vui lòng ký tên vào khu vực bên dưới
          </Text>

          <View
            ref={signatureRef}
            style={[
              styles.signatureCanvas,
              {
                width: canvasSize.width,
                height: canvasSize.height,
              },
            ]}
            {...panResponder.panHandlers}
          >
            {renderStrokes()}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                savedSignature && styles.disabledButton,
              ]}
              onPress={saveSignature}
              disabled={savedSignature}
            >
              <MaterialIcons name="save" size={20} color="white" />
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearSignature}
            >
              <MaterialIcons name="delete" size={20} color="white" />
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : initialSignature ? (
        <Image
          source={{ uri: initialSignature }}
          style={styles.signatureImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.emptyText}>Chưa có chữ ký</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    backgroundColor: "#48BB78",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  sizeControls: {
    marginBottom: 15,
  },
  sizeControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sizeLabel: {
    fontWeight: "bold",
  },
  sizeButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  sizeButton: {
    backgroundColor: "#E2E8F0",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  sizeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sizeValue: {
    marginHorizontal: 10,
    minWidth: 50,
    textAlign: "center",
  },
  instruction: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 10,
  },
  signatureCanvas: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
  },
  point: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "black",
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#48BB78",
  },
  clearButton: {
    backgroundColor: "#E53E3E",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  signatureImage: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#718096",
  },
});
