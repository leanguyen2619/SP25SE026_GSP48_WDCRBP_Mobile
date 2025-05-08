import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatDateTimeString } from "../../utils/utils";

const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const diffInSeconds = diff / 1000;
  const diffInDays = Math.floor(diffInSeconds / (60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears >= 1) return `${diffInYears} năm trước`;
  if (diffInMonths >= 1) return `${diffInMonths} tháng trước`;
  if (diffInDays >= 1)
    return diffInDays === 1 ? "1 ngày trước" : `${diffInDays} ngày trước`;
  return "hôm nay";
};

const RelativeTime = ({ dateString, style }) => {
  const [showFullDate, setShowFullDate] = useState(false);

  const toggleDateFormat = () => {
    setShowFullDate(!showFullDate);
  };

  return (
    <TouchableOpacity onPress={toggleDateFormat} activeOpacity={0.7}>
      <Text style={[styles.dateText, style]}>
        Đăng vào:{" "}
        {showFullDate
          ? formatDateTimeString(dateString)
          : getRelativeTime(dateString)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateText: {
    color: "#718096", // equivalent to gray.500 in Chakra UI
    fontSize: 12,
  },
});

export default RelativeTime;
