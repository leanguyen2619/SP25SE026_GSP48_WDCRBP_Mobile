import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { appColorTheme } from "../../config/appconfig";

export default function Pagination({
  dataList,
  DisplayComponent,
  itemsPerPage = 4,
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
  };

  const paginatedItems = dataList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Calculate page count
  const pageCount = Math.ceil(dataList.length / itemsPerPage);

  // Create an array of visible page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalVisible = 5; // Total visible page numbers including dots

    if (pageCount <= totalVisible) {
      // Show all pages if there are few pages
      for (let i = 0; i < pageCount; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(0);

      if (currentPage > 1) {
        // Show dots if current page is far from start
        if (currentPage > 2) {
          pageNumbers.push("...");
        }
        // Show previous page
        pageNumbers.push(currentPage - 1);
      }

      // Show current page if not first or last
      if (currentPage !== 0 && currentPage !== pageCount - 1) {
        pageNumbers.push(currentPage);
      }

      if (currentPage < pageCount - 2) {
        // Show next page
        pageNumbers.push(currentPage + 1);
        // Show dots if current page is far from end
        if (currentPage < pageCount - 3) {
          pageNumbers.push("...");
        }
      }

      // Always show last page
      pageNumbers.push(pageCount - 1);
    }

    return pageNumbers;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Tìm thấy {dataList.length} kết quả</Text>

      <DisplayComponent data={paginatedItems} />

      {pageCount > 1 && (
        <View style={styles.paginationContainer}>
          {/* Previous Button */}
          <TouchableOpacity
            onPress={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={[
              styles.pageButton,
              currentPage === 0 && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageButtonText}>«</Text>
          </TouchableOpacity>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNumber, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                pageNumber !== "..." && handlePageChange(pageNumber)
              }
              disabled={pageNumber === "..."}
              style={[
                styles.pageButton,
                pageNumber === currentPage && styles.activePageButton,
                pageNumber === "..." && styles.dotsButton,
              ]}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  pageNumber === currentPage && styles.activePageButtonText,
                ]}
              >
                {pageNumber === "..." ? "..." : pageNumber + 1}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Next Button */}
          <TouchableOpacity
            onPress={() =>
              handlePageChange(Math.min(pageCount - 1, currentPage + 1))
            }
            disabled={currentPage === pageCount - 1}
            style={[
              styles.pageButton,
              currentPage === pageCount - 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageButtonText}>»</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultText: {
    marginBottom: 8,
    fontSize: 14,
    color: "#4A5568",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#EDF2F7",
  },
  pageButtonText: {
    fontSize: 14,
    color: "#4A5568",
  },
  activePageButton: {
    backgroundColor: appColorTheme.brown_2,
  },
  activePageButtonText: {
    color: "#FFFFFF",
  },
  disabledButton: {
    backgroundColor: "#EDF2F7",
    opacity: 0.5,
  },
  dotsButton: {
    backgroundColor: "transparent",
  },
});
