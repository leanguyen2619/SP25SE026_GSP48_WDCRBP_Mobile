import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const packTypeColors = {
  BRONZE: '#cd7f32',
  SILVER: '#c0c0c0',
  GOLD: '#ffd700',
};

const WoodworkerInfo = ({ woodworker }) => {
  const navigation = useNavigation();
  const packType = woodworker?.packType?.toUpperCase() || 'BRONZE';
  const packColor = packTypeColors[packType] || packTypeColors.BRONZE;

  const handlePress = () => {
    navigation.navigate('WoodworkerDetail', { 
      woodworkerId: woodworker.woodworkerId 
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.infoContainer}>
        {woodworker?.woodworkerImgUrl ? (
          <Image
            source={{ uri: woodworker.woodworkerImgUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Icon name="person" size={30} color="#666" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{woodworker?.woodworkerName || 'Chưa có thông tin'}</Text>
          <Text style={styles.address}>{woodworker?.address || 'Chưa có địa chỉ'}</Text>
          <View style={[styles.packageBadge, { backgroundColor: packColor }]}>
            <Icon name="star" size={16} color="#fff" />
            <Text style={styles.packageText}>Gói dịch vụ: {woodworker?.packType || 'Chưa có'}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={24} color="#666" style={styles.arrow} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  packageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  packageText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  }
});

export default WoodworkerInfo; 