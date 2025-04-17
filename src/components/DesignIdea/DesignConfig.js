import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { appColorTheme } from '../../theme/colors';

const BASE_URL = 'http://10.0.2.2:8080';

const DesignConfig = ({ designId, onConfigChange }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [configOptions, setConfigOptions] = useState({});
    const [selectedValues, setSelectedValues] = useState({});

    useEffect(() => {
        if (designId) {
            loadConfigurations();
        }
    }, [designId]);

    const loadConfigurations = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${BASE_URL}/api/v1/designIdea/getDesignIdeaVariantByDesignId/${designId}`
            );

            if (!response.data?.data || !Array.isArray(response.data.data)) {
                throw new Error('Không có dữ liệu trả về từ API');
            }

            const variantData = response.data.data;
            setVariants(variantData);

            // Tách các options có thể chọn theo từng loại cấu hình
            const options = {};
            const defaultValues = {};

            variantData.forEach(variant => {
                if (Array.isArray(variant.designIdeaVariantConfig)) {
                    variant.designIdeaVariantConfig.forEach(config => {
                        if (Array.isArray(config.designVariantValues)) {
                            config.designVariantValues.forEach(value => {
                                if (value.designIdeaConfig?.specifications) {
                                    const specification = value.designIdeaConfig.specifications;
                                    const configId = value.designIdeaConfig.designIdeaConfigId;
                                    
                                    if (!options[configId]) {
                                        options[configId] = {
                                            title: specification,
                                            values: new Set()
                                        };
                                    }
                                    
                                    const valueStr = value.value?.toString() || '';
                                    options[configId].values.add(valueStr);
                                }
                            });
                        }
                    });
                }
            });

            // Chuyển đổi Set thành Array và set giá trị mặc định
            Object.keys(options).forEach(configId => {
                options[configId].values = Array.from(options[configId].values);
                defaultValues[configId] = options[configId].values[0] || '';
            });

            setConfigOptions(options);
            setSelectedValues(defaultValues);

            // Tìm variant phù hợp với giá trị mặc định
            const defaultVariant = findMatchingVariant(variantData, defaultValues);
            if (defaultVariant) {
                setSelectedVariant(defaultVariant);
                onConfigChange?.({
                    variantId: defaultVariant.designIdeaVariantId,
                    configs: defaultValues,
                    price: defaultVariant.price
                });
            }

        } catch (err) {
            console.error('Error:', err.message);
            setError('Không thể tải cấu hình sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const findMatchingVariant = (variants, selectedConfigs) => {
        return variants.find(variant => {
            const configMatches = Object.entries(selectedConfigs).every(([configId, selectedValue]) => {
                let hasMatch = false;
                
                if (Array.isArray(variant.designIdeaVariantConfig)) {
                    variant.designIdeaVariantConfig.forEach(config => {
                        if (Array.isArray(config.designVariantValues)) {
                            config.designVariantValues.forEach(value => {
                                if (value.designIdeaConfig?.designIdeaConfigId.toString() === configId &&
                                    value.value === selectedValue) {
                                    hasMatch = true;
                                }
                            });
                        }
                    });
                }
                
                return hasMatch;
            });

            return configMatches;
        });
    };

    const handleSelectOption = (configId, value) => {
        const newValues = {
            ...selectedValues,
            [configId]: value
        };
        setSelectedValues(newValues);

        const matchingVariant = findMatchingVariant(variants, newValues);
        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            onConfigChange?.({
                variantId: matchingVariant.designIdeaVariantId,
                configs: newValues,
                price: matchingVariant.price
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={appColorTheme.brown_0} />
                <Text style={styles.loadingText}>Đang tải cấu hình...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadConfigurations}>
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Cấu hình sản phẩm</Text>

            {Object.entries(configOptions).map(([configId, config]) => (
                <View key={configId} style={styles.configSection}>
                    <Text style={styles.configTitle}>{config.title}</Text>
                    <View style={styles.optionsContainer}>
                        {config.values.map((value, index) => (
                            <TouchableOpacity
                                key={`${configId}-${index}`}
                                style={[
                                    styles.optionButton,
                                    value === selectedValues[configId] && styles.selectedOption
                                ]}
                                onPress={() => handleSelectOption(configId, value)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    value === selectedValues[configId] && styles.selectedOptionText
                                ]}>
                                    {value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            {selectedVariant?.price > 0 && (
                <Text style={styles.priceText}>
                    {Number(selectedVariant.price).toLocaleString('vi-VN')} đ
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: appColorTheme.black_0,
        marginBottom: 16,
    },
    configSection: {
        marginBottom: 16,
    },
    configTitle: {
        fontSize: 14,
        color: appColorTheme.black_0,
        marginBottom: 8,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: appColorTheme.grey_1,
        fontSize: 14,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: appColorTheme.red_0,
        marginBottom: 12,
    },
    retryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: appColorTheme.brown_0,
        borderRadius: 6,
    },
    retryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: appColorTheme.grey_0,
        backgroundColor: '#fff',
    },
    selectedOption: {
        backgroundColor: appColorTheme.brown_0,
        borderColor: appColorTheme.brown_0,
    },
    optionText: {
        fontSize: 14,
        color: appColorTheme.grey_1,
    },
    selectedOptionText: {
        color: '#fff',
    },
    priceText: {
        fontSize: 24,
        fontWeight: '600',
        color: appColorTheme.brown_0,
        marginTop: 16,
    }
});

export default DesignConfig; 