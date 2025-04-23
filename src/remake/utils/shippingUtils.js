/**
 * Extract dimensions from variant config (length x width x height)
 * @param {Object} config - The design variant config object
 * @returns {Object} Dimensions object with length, width, and height
 */
export const extractDimensionsFromConfig = (config) => {
  try {
    const dimensionStr = config.designVariantValues[0].value;

    const dimensions = dimensionStr
      .split("x")
      .map((dim) => parseFloat(dim.trim()));

    if (dimensions.length === 3) {
      return {
        length: dimensions[0] || 20,
        width: dimensions[1] || 20,
        height: dimensions[2] || 20,
      };
    }

    return { length: 20, width: 20, height: 20 };
  } catch (error) {
    return { length: 20, width: 20, height: 20 };
  }
};

/**
 * Extract dimensions from product object (handles different product types)
 * @param {Object} product - The product object
 * @returns {Object} Dimensions object with length, width, and height
 */
export const extractDimensionsFromProduct = (product) => {
  try {
    if (product.designIdeaVariantDetail?.designIdeaVariantConfig) {
      const config = product.designIdeaVariantDetail.designIdeaVariantConfig[0];
      return extractDimensionsFromConfig(config);
    } else if (product.personalProductDetail) {
      return {
        length:
          product.personalProductDetail.techSpecList.find(
            (item) => item.name === "Chiều dài"
          )?.value || 20,
        width:
          product.personalProductDetail.techSpecList.find(
            (item) => item.name === "Chiều rộng"
          )?.value || 20,
        height:
          product.personalProductDetail.techSpecList.find(
            (item) => item.name === "Chiều cao"
          )?.value || 20,
      };
    } else {
      // Standard product with direct dimensions
      return {
        length: product.product.length || 20,
        width: product.product.width || 20,
        height: product.product.height || 20,
      };
    }
  } catch (error) {
    return { length: 20, width: 20, height: 20 };
  }
};

/**
 * Calculate the cheapest shipping option based on product dimensions and addresses
 * @param {Object} params The parameters needed for shipping calculation
 * @returns {Promise<Object>} Object containing cheapest service and fee
 */
export const calculateCheapestShipping = async ({
  fromDistrictId,
  fromWardCode,
  toDistrictId,
  toWardCode,
  items,
  getAvailableServices,
  calculateShippingFee,
}) => {
  try {
    // Step 1: Fetch available services
    const servicesData = {
      from_district: fromDistrictId,
      to_district: toDistrictId,
      shop_id: 0,
    };

    const servicesResponse = await getAvailableServices(servicesData).unwrap();
    const services = servicesResponse.data.data || [];

    if (!services.length) {
      return { selectedService: null, shippingFee: 0 };
    }

    // Step 2: Calculate shipping fee for each service
    let cheapestService = null;
    let cheapestFee = Infinity;

    for (const service of services) {
      try {
        const shippingData = {
          from_district_id: +fromDistrictId,
          from_ward_code: fromWardCode,
          to_district_id: +toDistrictId,
          to_ward_code: toWardCode,
          service_id: service.service_id,
          service_type_id: service.service_type_id,
          insurance_value: 0,
          cod_failed_amount: 0,
          coupon: "",
          height: 0,
          length: 0,
          width: 0,
          weight: 0,
          items: items,
        };

        const response = await calculateShippingFee(shippingData).unwrap();
        const fee = response.data.data.total || 0;

        if (fee < cheapestFee) {
          cheapestFee = fee;
          cheapestService = { ...service, fee };
        }
      } catch (error) {
        console.error(
          `Error calculating fee for service ${service.service_id}:`,
          error
        );
      }
    }

    // Step 3: Return the selected service and base fee without any multiplier
    return {
      selectedService: cheapestService,
      shippingFee: cheapestService ? cheapestService.fee : 0,
    };
  } catch (error) {
    console.error("Error in shipping calculation:", error);
    return { selectedService: null, shippingFee: 0 };
  }
};

/**
 * Create a GHN shipment for a service order and update the order code
 * @param {Object} params - Parameters needed for shipment creation
 * @returns {Promise<Object>} Result containing order code and success status
 */
export const createAndUpdateShipment = async ({
  order,
  products,
  shipment,
  serviceOrderId,
  createShipment,
  updateShipmentOrderCode,
}) => {
  // Prepare items data with dimensions for shipment
  const items = products.map((product) => {
    // Use the existing utility function to extract dimensions consistently
    const dimensions = extractDimensionsFromProduct(product);

    return {
      name:
        product.designIdeaVariantDetail?.name ||
        product.category?.categoryName ||
        "Sản phẩm",
      quantity: product.quantity || 1,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      weight: 0,
    };
  });

  // Extract address components from comma-separated address string
  const addressParts = order?.service?.wwDto?.address?.split(",") || [];
  const wardName = addressParts[1]?.trim() || "N/A";
  const districtName = addressParts[2]?.trim() || "N/A";
  const provinceName = addressParts[3]?.trim() || "N/A";

  // Prepare GHN shipment request
  const requestData = {
    payment_type_id: 1,
    required_note: "WAIT",
    // Sender information
    from_name: order?.service?.wwDto?.name,
    from_phone: order?.service?.wwDto?.phone,
    from_address: shipment.fromAddress,
    from_ward_name: wardName,
    from_district_name: districtName,
    from_province_name: provinceName,
    // Receiver information
    to_phone: order?.user?.phone,
    to_name: order?.user?.username,
    to_address: shipment.toAddress,
    to_ward_code: shipment.toWardCode,
    to_district_id: shipment.toDistrictId,
    // Package information
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    service_type_id: shipment.ghnServiceTypeId || 5,
    items: items,
  };

  // Step 1: Create the shipment
  const response = await createShipment({
    serviceOrderId,
    data: requestData,
  }).unwrap();

  const orderCode = response.data.data.order_code;

  // Step 2: Update the shipment order code
  await updateShipmentOrderCode({
    serviceOrderId,
    orderCode,
  }).unwrap();

  return {
    success: true,
    orderCode,
  };
};

/**
 * Create a GHN shipment for a guarantee order to get product from customer
 * @param {Object} params - Parameters needed for shipment creation
 * @returns {Promise<Object>} Result containing order code and success status
 */
export const createAndUpdateShipmentForGuaranteeGetProductFromCustomer =
  async ({
    order,
    product,
    shipmentData,
    guaranteeOrderId,
    createShipment,
    updateShipmentOrderCode,
    notify,
  }) => {
    try {
      if (!shipmentData?.data || shipmentData.data.length === 0) {
        notify && notify("Lỗi", "Không tìm thấy thông tin vận chuyển", "error");
        return { success: false };
      }

      // Get the first shipment
      const shipment = shipmentData.data[0];
      if (!shipment) {
        notify && notify("Lỗi", "Không tìm thấy thông tin vận chuyển", "error");
        return { success: false };
      }

      // Extract dimensions from the product
      const dimensions = extractDimensionsFromProduct(product);

      // Prepare items for GHN API
      const items = [
        {
          name:
            product.designIdeaVariantDetail?.name ||
            product.category?.categoryName ||
            "Sản phẩm bảo hành",
          quantity: 1,
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
          weight: 0,
        },
      ];

      // Create GHN shipment request
      const requestData = {
        payment_type_id: 1,
        required_note: "WAIT",
        // Sender information (customer)
        from_name: order?.user?.username,
        from_phone: order?.user?.phone,
        from_address: shipment.fromAddress,
        from_ward_name: shipment.fromAddress?.split(",")[1]?.trim() || "N/A",
        from_district_name:
          shipment.fromAddress?.split(",")[2]?.trim() || "N/A",
        from_province_name:
          shipment.fromAddress?.split(",")[3]?.trim() || "N/A",
        // Receiver information (woodworker)
        to_phone: order?.woodworkerUser?.phone,
        to_name: order?.woodworkerUser?.username,
        to_address: shipment.toAddress,
        to_ward_code: shipment.toWardCode,
        to_district_id: shipment.toDistrictId,
        // Package information
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        service_type_id: shipment.ghnServiceTypeId || 5,
        items: items,
      };

      // Create the shipment
      const response = await createShipment({
        serviceOrderId: guaranteeOrderId,
        data: requestData,
      }).unwrap();

      // Get order code from response
      const orderCode = response.data.data.order_code;

      // Update shipment with order code
      await updateShipmentOrderCode({
        guaranteeOrderId: guaranteeOrderId,
        orderCode: orderCode,
        type: "Lấy",
      }).unwrap();

      notify &&
        notify(
          "Thành công",
          `Đã tạo vận đơn lấy hàng thành công với mã: ${orderCode}`,
          "success"
        );

      return {
        success: true,
        orderCode,
      };
    } catch (error) {
      notify &&
        notify(
          "Lỗi vận chuyển",
          error.data?.message || error.message || "Không thể tạo vận đơn",
          "error"
        );
      return { success: false };
    }
  };
