export const appColorTheme = {
  brown_0: "#F8E1B7",
  brown_1: "#754E1A",
  brown_2: "#D17B49",
  grey_0: "#f9fafb",
  grey_1: "#F4F6F8",
  grey_2: "#EAEAEA",
  black_0: "#00060F",
  white_0: "#ffffff",
  green_0: "#38a169",
  green_1: "#9AE6B4", // Light green
  green_2: "#68D391", // Medium light green
  green_3: "#48BB78", // Medium green
  blue_0: "#3182ce",
  red_0: "#e53e3e",
  purple_0: "#9f7aea",
  orange_0: "#f6ad55",
  yellow_0: "#f6e05e",
  pink_0: "#f687b3",
  pink_1: "#FBB6CE", // Light pink
  pink_2: "#F687B3", // Medium pink
  pink_3: "#ED64A6", // Darker pink
  teal_0: "#4fd1c5",
  cyan_0: "#0dcaf0",
  lime_0: "#a6f4c5",
  fuchsia_0: "#d946ef",
  rose_0: "#f43f5e",
};

export const configuration = {
  GHN_Token_API: "GHN_Token_API",
  SampleContract: "SampleContract",
  PlatformSignature: "PlatformSignature",
};

export const transactionTypeConstants = {
  NAP_VI: "Nạp ví",
  RUT_VI: "Rút ví",
  THANH_TOAN_BANG_VI: "Thanh toán bằng ví",
  THANH_TOAN_QUA_CONG: "Thanh toán bằng VNPay",
  NHAN_TIEN: "Nhận tiền",
  HOAN_TIEN: "Nhận hoàn tiền",
  TRU_HOAN_TIEN: "Hoàn tiền cho khách hàng",
};

export const paymentForConstants = {
  ORDER_PAYMENT: "Thanh toán đơn hàng",
  SERVICE_PACK_PAYMENT: "Thanh toán gói dịch vụ",
  WALLET_PAYMENT: "Thanh toán nạp ví",
  REFUND_PAYMENT: "Thanh toán hoàn tiền",
  OTHER: "Khác",
};

export const servicePackNameConstants = {
  GOLD: "Gold",
  SILVER: "Silver",
  BRONZE: "Bronze",
};

export const serviceOrderStatusConstants = {
  DANG_CHO_THO_DUYET: "Đang chờ xưởng mộc xác nhận đơn hàng",
  DANG_CHO_KHACH_DUYET_LICH_HEN: "Đang chờ khách hàng duyệt lịch hẹn",
  DA_DUYET_LICH_HEN: "Đã duyệt lịch hẹn",
  DANG_CHO_KHACH_DUYET_HOP_DONG: "Đang chờ khách hàng duyệt hợp đồng",
  DA_DUYET_HOP_DONG: "Đã duyệt hợp đồng",
  DANG_CHO_KHACH_DUYET_THIET_KE: "Đang chờ khách hàng duyệt thiết kế",
  DA_DUYET_THIET_KE: "Đã duyệt thiết kế",
  DANG_GIA_CONG: "Đang gia công",
  DANG_GIAO_HANG_LAP_DAT: "Đang giao hàng lắp đặt",
  DA_HOAN_TAT: "Đã hoàn tất",
  DA_HUY: "Đã hủy",
};

// Add function to get color for service order status
export const getServiceOrderStatusColor = (status) => {
  switch (status) {
    case serviceOrderStatusConstants.DA_HOAN_TAT:
      return "green";
    case serviceOrderStatusConstants.DANG_GIA_CONG:
    case serviceOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT:
      return "blue";
    case serviceOrderStatusConstants.DANG_CHO_THO_DUYET:
    case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN:
    case serviceOrderStatusConstants.DA_DUYET_LICH_HEN:
    case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG:
    case serviceOrderStatusConstants.DA_DUYET_HOP_DONG:
    case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_THIET_KE:
    case serviceOrderStatusConstants.DA_DUYET_THIET_KE:
      return "orange";
    case serviceOrderStatusConstants.DA_HUY:
      return "red";
    default:
      return "gray";
  }
};

export const guaranteeOrderStatusConstants = {
  DANG_CHO_THO_MOC_XAC_NHAN: "Đang chờ xưởng mộc xác nhận đơn hàng",
  DANG_CHO_KHACH_DUYET_LICH_HEN: "Đang chờ khách hàng duyệt lịch hẹn",
  DA_DUYET_LICH_HEN: "Đã duyệt lịch hẹn",
  DANG_CHO_KHACH_DUYET_BAO_GIA: "Đang chờ khách hàng duyệt báo giá",
  DA_DUYET_BAO_GIA: "Đã duyệt báo giá",
  DANG_CHO_NHAN_HANG: "Đang chờ nhận hàng để sửa chữa",
  DANG_SUA_CHUA: "Đang sửa chữa",
  DANG_GIAO_HANG_LAP_DAT: "Đang giao hàng lắp đặt",
  DA_HOAN_TAT: "Đã hoàn tất",
  DA_HUY: "Đã hủy",
};

// Add function to get color for guarantee order status
export const getGuaranteeOrderStatusColor = (status) => {
  switch (status) {
    case guaranteeOrderStatusConstants.DA_HOAN_TAT:
      return "green";
    case guaranteeOrderStatusConstants.DANG_SUA_CHUA:
    case guaranteeOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT:
      return "blue";
    case guaranteeOrderStatusConstants.DANG_CHO_THO_MOC_XAC_NHAN:
    case guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN:
    case guaranteeOrderStatusConstants.DA_DUYET_LICH_HEN:
    case guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_BAO_GIA:
    case guaranteeOrderStatusConstants.DA_DUYET_BAO_GIA:
    case guaranteeOrderStatusConstants.DANG_CHO_NHAN_HANG:
      return "orange";
    case guaranteeOrderStatusConstants.DA_HUY:
      return "red";
    default:
      return "gray";
  }
};

export const transactionTypeColorMap = {
  [transactionTypeConstants.NAP_VI]: "#38a169",
  [transactionTypeConstants.RUT_VI]: "#9f7aea",
  [transactionTypeConstants.THANH_TOAN_BANG_VI]: "#9f7aea",
  [transactionTypeConstants.THANH_TOAN_QUA_CONG]: "#9f7aea",
  [transactionTypeConstants.NHAN_TIEN]: "#38a169",
  [transactionTypeConstants.HOAN_TIEN]: "#38a169",
  [transactionTypeConstants.TRU_HOAN_TIEN]: "#9f7aea",
};

export const complaintStatusConstants = {
  PENDING: "Đang chờ tường trình từ xưởng mộc",
  IN_PROGRESS: "Đang chờ xử lý",
  CANCELED: "Đã từ chối xử lý",
  COMPLETED: "Đã xử lý",
};

export const getComplaintStatusColor = (status) => {
  const statusColorMap = {
    [complaintStatusConstants.PENDING]: "#9f7aea", // Red 500
    [complaintStatusConstants.IN_PROGRESS]: "#ED8936", // Orange 500
    [complaintStatusConstants.CANCELED]: "#F56565", // Gray 400-500-ish
    [complaintStatusConstants.COMPLETED]: "#48BB78", // Green 500
  };

  return statusColorMap[status] || "#A0AEC0"; // default gray
};

export const service = {
  ["Personalization"]: {
    serviceName: "Dịch vụ cá nhân hóa",
    serviceAlterName: "Dịch vụ cá nhân hóa",
    serviceType: "Personalization",
    description:
      "Dịch vụ thiết kế và gia công theo ý tưởng khách hàng, giúp bạn biến ý tưởng thành hiện thực.",
    path: "PersonalizationRequest",
    buttonText: "Đặt dịch vụ",
    action: "navigate",
  },
  ["Customization"]: {
    serviceName: "Dịch vụ tùy chỉnh",
    serviceAlterName: "Dịch vụ tùy chỉnh",
    serviceType: "Customization",
    description:
      "Dịch vụ gia công theo ý tưởng thiết kế của xưởng, đảm bảo chất lượng và độ chính xác.",
    path: "design",
    buttonText: "Xem thiết kế",
    action: "changeTab",
    tabIndex: 2,
  },
  ["Guarantee"]: {
    serviceName: "Dịch vụ sửa chữa / bảo hành",
    serviceType: "Guarantee",
    serviceAlterName: "Dịch vụ BH / sửa chữa",
    description:
      "Dịch vụ sửa chữa và bảo hành sản phẩm của xưởng, đảm bảo sự hài lòng của khách hàng.",
    path: "GuaranteeRequest",
    buttonText: "Đặt dịch vụ",
    action: "navigate",
  },
  ["Sale"]: {
    serviceName: "Dịch vụ bán hàng",
    serviceType: "Sale",
    serviceAlterName: "Dịch vụ Bán hàng",
    description:
      "Dịch vụ bán sản phẩm có sẵn, giúp bạn dễ dàng lựa chọn sản phẩm phù hợp.",
    path: "products",
    buttonText: "Xem sản phẩm",
    action: "changeTab",
    tabIndex: 3,
  },
};

export const getServiceTypeLabel = function (type) {
  const map = {
    Customization: "Tùy chỉnh",
    Personalization: "Cá nhân hóa",
    Sale: "Mua hàng",
    Guarantee: "Sửa chữa / Bảo hành",
  };
  return map[type] || type;
};

export const getPackTypeLabel = function (type) {
  const map = {
    Gold: "Xưởng vàng",
    Silver: "Xưởng bạc",
    Bronze: "Xưởng đồng",
  };
  return map[type] || type;
};
