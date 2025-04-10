import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWoodworkers } from '../../redux/slice/woodworkerSlice';
import Footer from '../../components/common/footer/footer';
import ServiceBadge from '../../components/common/Badge/ServiceBadge';

const servicePackColors = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

const servicePackPriority = {
  bronze: 1,
  silver: 2,
  gold: 3,
};

const WoodworkerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { list: workshops, loading, error } = useSelector((state) => state.woodworker);

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);

  const [filterValues, setFilterValues] = useState({
    totalStar: '',
    address: '',
    packType: '',
  });

  useEffect(() => {
    dispatch(fetchWoodworkers());
  }, [dispatch]);

  const normalizeText = (text) =>
    text?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  useEffect(() => {
    const normalizedSearch = normalizeText(searchText);

    const result = workshops
      .filter((w) => {
        const starInput = parseFloat(filterValues.totalStar);
        const starOk = !filterValues.totalStar || parseFloat(w.totalStar ?? 0) === starInput;
        const addressOk = !filterValues.address || normalizeText(w.address).includes(normalizeText(filterValues.address));
        const packOk = !filterValues.packType || w.servicePack?.name?.toLowerCase() === filterValues.packType.toLowerCase();
        const searchOk = !normalizedSearch || normalizeText(w.brandName).includes(normalizedSearch);
        return starOk && addressOk && packOk && searchOk;
      })
      .sort((a, b) => {
        const aPack = a.servicePack?.name?.toLowerCase();
        const bPack = b.servicePack?.name?.toLowerCase();
        return (servicePackPriority[bPack] || 0) - (servicePackPriority[aPack] || 0);
      });

    setFilteredWorkshops(result);
  }, [workshops, filterValues, searchText, filtersApplied]);

  const applyFilters = () => setFiltersApplied(true);
  const clearFilters = () => {
    setFilterValues({ totalStar: '', address: '', packType: '' });
    setSearchText('');
    setFiltersApplied(false);
  };

  const removeFilterChip = (key) => {
    setFilterValues((prev) => ({ ...prev, [key]: '' }));
    setFiltersApplied(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách xưởng mộc</Text>
      </View>

      {/* 🔍 Search + Filter */}
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tên xưởng..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={applyFilters}>
            <Icon name="search" size={22} color="#f97316" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setFilterOpen(true)} style={styles.filterToggle}>
          <Icon name="filter-list" size={24} color="#f97316" />
        </TouchableOpacity>
      </View>

      {/* 🏷️ Filter Chips */}
      <View style={styles.chipContainer}>
        {Object.entries(filterValues).map(([key, val]) =>
          val ? (
            <TouchableOpacity key={key} style={styles.chip} onPress={() => removeFilterChip(key)}>
              <Text style={styles.chipText}>{val}</Text>
              <Icon name="close" size={16} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ) : null
        )}
      </View>

      {/* 📦 Filter Modal */}
      <Modal isVisible={filterOpen} onBackdropPress={() => setFilterOpen(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Lọc xưởng mộc</Text>

          <TextInput style={styles.filterInput} placeholder="Số sao (ví dụ 4)" keyboardType="numeric"
            value={filterValues.totalStar} onChangeText={(text) => setFilterValues({ ...filterValues, totalStar: text })} />
          <TextInput style={styles.filterInput} placeholder="Địa chỉ (TPHCM...)"
            value={filterValues.address} onChangeText={(text) => setFilterValues({ ...filterValues, address: text })} />

          <View style={styles.pickerWrapper}>
            <Picker selectedValue={filterValues.packType} onValueChange={(itemValue) =>
              setFilterValues({ ...filterValues, packType: itemValue })}>
              <Picker.Item label="Chọn gói dịch vụ" value="" />
              <Picker.Item label="Bronze" value="bronze" />
              <Picker.Item label="Silver" value="silver" />
              <Picker.Item label="Gold" value="gold" />
            </Picker>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.applyButton} onPress={() => {
              applyFilters();
              setFilterOpen(false);
            }}>
              <Text style={styles.buttonText}>Áp dụng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Làm mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 📋 Workshop List */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 14, color: '#888' }}>
            {loading ? 'Đang tải...' : `Tìm thấy ${filteredWorkshops.length} xưởng`}
          </Text>
          {error && <Text style={{ color: 'red' }}>Lỗi: {error}</Text>}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {filteredWorkshops.map((w) => {
            const packName = w.servicePack?.name?.toLowerCase();
            const badgeColor = servicePackColors[packName] || '#aaa';

            return (
              <TouchableOpacity key={w.woodworkerId} style={styles.card}>
                <Image source={{ uri: w.imgUrl }} style={styles.image} />
                <View style={{ padding: 12 }}>
                  <Text style={styles.name}>{w.brandName}</Text>
                  <Text style={styles.address}>{w.address}</Text>
                  <ServiceBadge packType={w.servicePack?.name} />
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {w.totalStar ?? 5} ({w.totalReviews ?? 10} đánh giá)
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default WoodworkerScreen;

const styles = StyleSheet.create({
  container: { paddingTop: 20, flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerText: { fontSize: 20, fontWeight: '600', color: '#f97316', textAlign: 'center' },
  topBar: {
    flexDirection: 'row', padding: 12, gap: 8, alignItems: 'center', backgroundColor: '#fff',
  },
  searchWrapper: { flex: 1, position: 'relative', justifyContent: 'center' },
  searchInput: {
    backgroundColor: '#f1f1f1', paddingHorizontal: 12, borderRadius: 8, height: 40, paddingRight: 40,
  },
  searchIcon: { position: 'absolute', right: 10, padding: 4 },
  filterToggle: { padding: 8 },
  chipContainer: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, gap: 8, paddingBottom: 8, backgroundColor: '#f8f9fa',
  },
  chip: {
    backgroundColor: '#f97316', paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center',
  },
  chipText: { color: '#fff', fontSize: 13 },
  modal: { margin: 0, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#f97316',
  },
  filterInput: {
    backgroundColor: '#f1f1f1', borderRadius: 8,
    paddingHorizontal: 12, marginTop: 10, height: 40,
  },
  pickerWrapper: {
    backgroundColor: '#f1f1f1', marginTop: 10, borderRadius: 8, overflow: 'hidden',
  },
  filterActions: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 16,
  },
  applyButton: {
    flex: 1, backgroundColor: '#f97316', padding: 12,
    borderRadius: 8, alignItems: 'center', marginRight: 8,
  },
  clearButton: {
    flex: 1, backgroundColor: '#ddd', padding: 12,
    borderRadius: 8, alignItems: 'center', marginLeft: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  clearButtonText: { color: '#333', fontWeight: '500' },
  card: {
    backgroundColor: '#fff', marginBottom: 16,
    borderRadius: 8, overflow: 'hidden', elevation: 1,
  },
  image: { width: '100%', height: 200 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  address: { fontSize: 14, color: '#666' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { marginLeft: 4, color: '#888' },
  badge: {
    alignSelf: 'flex-start',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
  },
});
