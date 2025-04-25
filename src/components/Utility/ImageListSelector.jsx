import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig";

const { width, height } = Dimensions.get("window");

export default function ImageListSelector({ imgUrls, imgH = 300 }) {
  const imageList = imgUrls ? imgUrls.split(";") : [];
  const [mainImage, setMainImage] = useState(imageList[0] || "");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Xử lý khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup nếu cần
    };
  }, []);

  // Switch mainImage to whichever thumbnail was clicked
  const handleThumbnailClick = (img) => {
    setMainImage(img);
  };

  // When main image is clicked, open fullscreen mode
  const handleMainImageClick = () => {
    if (mainImage) {
      setIsFullScreen(true);
    }
  };

  // Close fullscreen mode
  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  // Jump to the next image in the list
  const handleNextImage = () => {
    if (!imageList.length) return;
    const currentIndex = imageList.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % imageList.length;
    setMainImage(imageList[nextIndex]);
  };

  // Jump to the previous image in the list
  const handlePrevImage = () => {
    if (!imageList.length) return;
    const currentIndex = imageList.indexOf(mainImage);
    const prevIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    setMainImage(imageList[prevIndex]);
  };

  // Render thumbnail item
  const renderThumbnail = (img, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleThumbnailClick(img)}
        style={[
          styles.thumbnail,
          mainImage === img && styles.selectedThumbnail,
        ]}
      >
        <Image source={{ uri: img }} style={styles.thumbnailImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main Image Display */}
      <TouchableOpacity
        style={styles.mainImageContainer}
        onPress={handleMainImageClick}
        activeOpacity={0.9}
      >
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            style={[styles.mainImage, { height: imgH }]}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.noImage, { height: imgH }]}>
            <Text style={styles.noImageText}>Không có ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Thumbnail List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailContainer}
      >
        {imageList.map((img, index) => renderThumbnail(img, index))}
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseFullScreen}
      >
        <SafeAreaView style={styles.fullscreenContainer}>
          <StatusBar hidden={isFullScreen} />
          <View style={styles.fullscreenContent}>
            {/* Thumbnail Column */}
            <View style={styles.fullscreenThumbnailContainer}>
              <FlatList
                data={imageList}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setMainImage(item)}
                    style={[
                      styles.fullscreenThumbnail,
                      mainImage === item && styles.selectedThumbnail,
                    ]}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.fullscreenThumbnailImage}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Main Image Area */}
            <View style={styles.fullscreenImageContainer}>
              {/* Prev Button */}
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevImage}
              >
                <Ionicons name="chevron-back" size={30} color="white" />
              </TouchableOpacity>

              {/* Main Image */}
              <Image
                source={{ uri: mainImage }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />

              {/* Next Button */}
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNextImage}
              >
                <Ionicons name="chevron-forward" size={30} color="white" />
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseFullScreen}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  mainImageContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  noImage: {
    width: "100%",
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#718096",
  },
  thumbnailContainer: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  selectedThumbnail: {
    borderColor: appColorTheme.brown_2,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  fullscreenContent: {
    flex: 1,
    flexDirection: "row",
  },
  fullscreenThumbnailContainer: {
    width: 100,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 8,
  },
  fullscreenThumbnail: {
    width: 80,
    height: 80,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  fullscreenThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  fullscreenImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "90%",
    borderRadius: 8,
  },
  navButton: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
