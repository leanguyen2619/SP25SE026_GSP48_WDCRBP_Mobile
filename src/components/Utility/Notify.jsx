import Toast from "react-native-toast-message";

export const useNotify = () => {
  const notify = (title, description, status = "info", duration = 3000) => {
    // Map status to react-native-toast-message type
    let type = "info";
    switch (status) {
      case "success":
        type = "success";
        break;
      case "error":
        type = "error";
        break;
      case "warning":
        type = "warning";
        break;
      case "info":
      default:
        type = "info";
        break;
    }

    Toast.show({
      type,
      text1: title,
      text2: description,
      visibilityTime: duration,
      autoHide: true,
      topOffset: 50,
      position: "top",
    });
  };

  return notify;
};

// Cung cấp component Toast global để đặt ở dưới cùng của ứng dụng
export const ToastProvider = () => {
  return <Toast />;
};
