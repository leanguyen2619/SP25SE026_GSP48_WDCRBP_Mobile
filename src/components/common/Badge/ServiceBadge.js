import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const packTypeColors = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

const packTypeLabels = {
  bronze: 'đồng',
  silver: 'bạc',
  gold: 'vàng',
};

const ServiceBadge = ({ packType }) => {
  if (!packType) return null;

  const lowerPack = packType.toLowerCase();
  const color = packTypeColors[lowerPack] || '#aaa';
  const vietnameseLabel = packTypeLabels[lowerPack] || packType;

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Icon name="star" size={14} color="#fff" />
      <Text style={styles.text}>Gói {vietnameseLabel}</Text>
    </View>
  );
};

export default ServiceBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
