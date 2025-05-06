import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateString = (timestamp) => {
  return dayjs
    .utc(timestamp) // parse as UTC
    .tz("Asia/Ho_Chi_Minh") // convert to HCMC time
    .format("DD/MM/YYYY");
};

export const formatDateTimeString = (timestamp) => {
  return dayjs
    .utc(timestamp) // parse as UTC
    .tz("Asia/Ho_Chi_Minh") // convert to HCMC time
    .format("DD/MM/YYYY HH:mm");
};

export const formatDateToVietnamese = (dateString) => {
  if (!dateString) return "Chưa đăng ký";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTimeToVietnamese = (dateString) => {
  if (!dateString) return "Không có";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

export const getDateNow = () => {
  const currentDate = new Date();
  const vietnamTime = new Date(
    currentDate.getTime() + 7 * 60 * 60 * 1000
  ).toISOString();
  return vietnamTime;
};

export const generateBarcode = (type) => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return type.typeName.toUpperCase() + randomNum;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Format date for datetime-local input (YYYY-MM-DD format)
export const formatDateForInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function translateShippingStatus(status) {
  const statusMap = {
    ready_to_pick: "Đơn hàng vừa được tạo",
    picking: "Shipper đang đến lấy hàng",
    cancel: "Đơn hàng đã bị hủy",
    money_collect_picking: "Shipper đang tương tác với người bán",
    picked: "Shipper đã lấy hàng",
    storing: "Hàng đã được chuyển đến kho phân loại của GHN",
    transporting: "Hàng đang được luân chuyển",
    sorting: "Hàng đang được phân loại tại kho",
    delivering: "Shipper đang giao hàng cho khách",
    money_collect_delivering: "Shipper đang tương tác với người mua",
    delivered: "Hàng đã được giao cho khách",
    delivery_fail: "Không giao được hàng cho khách",
    waiting_to_return: "Chờ giao lại (trong vòng 24/48h)",
    return: "Chờ hoàn về do giao không thành công sau 3 lần",
    return_transporting: "Hàng hoàn đang được luân chuyển",
    return_sorting: "Hàng hoàn đang được phân loại tại kho",
    returning: "Shipper đang hoàn hàng về cho người bán",
    return_fail: "Hoàn hàng thất bại",
    returned: "Hàng đã hoàn về cho người bán",
    exception: "Xử lý ngoại lệ (đơn hàng phát sinh tình huống bất thường)",
    damage: "Hàng hóa bị hư hỏng",
    lost: "Hàng hóa bị thất lạc",
  };

  return statusMap[status] || "Trạng thái không xác định";
}
