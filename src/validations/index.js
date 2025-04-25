export const validateRegister = (data) => {
  const errors = [];

  // Validate username
  if (!data.username) {
    errors.push("Tên người dùng là bắt buộc");
  } else if (data.username.length < 3) {
    errors.push("Tên người dùng phải có ít nhất 3 ký tự");
  }

  // Validate email
  if (!data.email) {
    errors.push("Email là bắt buộc");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate password
  if (!data.password) {
    errors.push("Mật khẩu là bắt buộc");
  } else if (data.password.length < 4) {
    errors.push("Mật khẩu phải có ít nhất 4 ký tự");
  }

  // Validate rePassword
  if (!data.rePassword) {
    errors.push("Vui lòng nhập lại mật khẩu");
  } else if (data.password !== data.rePassword) {
    errors.push("Mật khẩu không trùng nhau");
  }

  // Validate phone
  if (!data.phone) {
    errors.push("Số điện thoại là bắt buộc");
  } else if (!/^0[0-9]{9}$/.test(data.phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }

  return errors;
};

export const validateWoodworkerRegister = (data) => {
  const errors = [];

  // Validate fullName
  if (!data.fullName) {
    errors.push("Họ và tên là bắt buộc");
  } else if (data.fullName.length < 3) {
    errors.push("Họ và tên phải có ít nhất 3 ký tự");
  }

  // Validate email
  if (!data.email) {
    errors.push("Email là bắt buộc");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate phone
  if (!data.phone) {
    errors.push("Số điện thoại là bắt buộc");
  } else if (!/^0[0-9]{9}$/.test(data.phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }

  // Validate brandName
  if (!data.brandName) {
    errors.push("Tên xưởng mộc là bắt buộc");
  } else if (data.brandName.length < 3) {
    errors.push("Tên xưởng mộc phải có ít nhất 3 ký tự");
  }

  // Validate businessType
  if (!data.businessType) {
    errors.push("Loại hình kinh doanh là bắt buộc");
  }

  // Validate address
  if (!data.address) {
    errors.push("Địa chỉ xưởng là bắt buộc");
  }

  // Validate wardCode, districtId, cityId
  if (!data.wardCode || !data.districtId || !data.cityId) {
    errors.push("Vui lòng chọn đầy đủ thông tin địa chỉ");
  }

  // Validate taxCode
  if (!data.taxCode) {
    errors.push("Mã số thuế là bắt buộc");
  } else if (!/^[0-9]{10}$/.test(data.taxCode)) {
    errors.push("Mã số thuế phải có 10 chữ số");
  }

  // Validate bio
  if (!data.bio) {
    errors.push("Giới thiệu là bắt buộc");
  }

  // Validate imgUrl
  if (!data.imgUrl) {
    errors.push("Ảnh đại diện là bắt buộc");
  }

  return errors;
};

export const validatePostData = (data) => {
  const errors = [];

  // Validate title
  if (!data.title) {
    errors.push("Tiêu đề là bắt buộc");
  } else if (data.title.length < 5) {
    errors.push("Tiêu đề phải có ít nhất 5 ký tự");
  }

  // Validate description
  if (!data.description) {
    errors.push("Mô tả là bắt buộc");
  } else if (data.description.length < 10) {
    errors.push("Mô tả phải có ít nhất 10 ký tự");
  }

  // Validate image URLs
  if (!validateImageUrls(data.imgUrls)) {
    errors.push("Vui lòng tải lên ít nhất một hình ảnh");
  }

  return errors;
};

export const validateProductData = (data) => {
  const errors = [];

  // Validate product name
  if (!data.productName) {
    errors.push("Tên sản phẩm là bắt buộc");
  } else if (data.productName.length < 3) {
    errors.push("Tên sản phẩm phải có ít nhất 3 ký tự");
  }

  // Validate description
  if (!data.description) {
    errors.push("Mô tả sản phẩm là bắt buộc");
  } else if (data.description.length < 10) {
    errors.push("Mô tả sản phẩm phải có ít nhất 10 ký tự");
  }

  // Validate price
  if (!data.price && data.price !== 0) {
    errors.push("Giá sản phẩm là bắt buộc");
  } else if (data.price < 0) {
    errors.push("Giá sản phẩm phải lớn hơn hoặc bằng 0");
  } else if (data.price > 50000000) {
    errors.push("Giá sản phẩm không được lớn hơn 50 triệu đồng");
  }

  // Validate stock
  if (!data.stock && data.stock !== 0) {
    errors.push("Số lượng tồn kho là bắt buộc");
  } else if (data.stock < 0) {
    errors.push("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
  }

  // Validate dimensions
  if (!data.length) {
    errors.push("Chiều dài sản phẩm là bắt buộc");
  } else if (data.length <= 0) {
    errors.push("Chiều dài sản phẩm phải lớn hơn 0");
  }

  if (!data.width) {
    errors.push("Chiều rộng sản phẩm là bắt buộc");
  } else if (data.width <= 0) {
    errors.push("Chiều rộng sản phẩm phải lớn hơn 0");
  }

  if (!data.height) {
    errors.push("Chiều cao sản phẩm là bắt buộc");
  } else if (data.height <= 0) {
    errors.push("Chiều cao sản phẩm phải lớn hơn 0");
  }

  // Validate warrantyDuration
  if (!data.warrantyDuration) {
    errors.push("Thời hạn bảo hành là bắt buộc");
  } else if (data.weight <= 0) {
    errors.push("Cân nặng sản phẩm phải lớn hơn 0");
  }

  // Validate woodType
  if (!data.woodType) {
    errors.push("Loại gỗ là bắt buộc");
  }

  // Validate color
  if (!data.color) {
    errors.push("Màu sắc là bắt buộc");
  }

  // Validate specialFeature
  if (!data.specialFeature) {
    errors.push("Tính năng đặc biệt là bắt buộc");
  }

  // Validate style
  if (!data.style) {
    errors.push("Phong cách là bắt buộc");
  }

  // Validate sculpture
  if (!data.sculpture) {
    errors.push("Điêu khắc là bắt buộc");
  }

  // Validate scent
  if (!data.scent) {
    errors.push("Mùi hương là bắt buộc");
  }

  // Validate categoryId
  if (!data.categoryId) {
    errors.push("Danh mục sản phẩm là bắt buộc");
  }

  // Validate image URLs
  if (!validateImageUrls(data.mediaUrls)) {
    errors.push("Vui lòng tải lên ít nhất một hình ảnh");
  }

  return errors;
};

export const validateImageUrls = (imgUrls) => {
  if (
    !imgUrls ||
    imgUrls === "" ||
    (Array.isArray(imgUrls) && imgUrls.length === 0)
  ) {
    return false;
  }
  return true;
};

export const validateCustomerPersonalInfo = (data) => {
  const errors = [];

  // Validate fullName
  if (!data.fullName) {
    errors.push("Họ và tên là bắt buộc");
  } else if (data.fullName.length < 3) {
    errors.push("Họ và tên phải có ít nhất 3 ký tự");
  }

  // Validate phone
  if (!data.phone) {
    errors.push("Số điện thoại là bắt buộc");
  } else if (!/^0[0-9]{9}$/.test(data.phone)) {
    errors.push(
      "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 chữ số)"
    );
  }

  // Validate email if it's editable
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate password if the user is updating with password
  if (data.isUpdating && !data.password) {
    errors.push("Vui lòng nhập mật khẩu để xác nhận thay đổi");
  }

  return errors;
};

export const validateWoodworkerPersonalInfo = (data) => {
  const errors = [];

  // Validate fullName
  if (!data.fullName) {
    errors.push("Họ và tên là bắt buộc");
  } else if (data.fullName.length < 3) {
    errors.push("Họ và tên phải có ít nhất 3 ký tự");
  }

  // Validate phone
  if (!data.phone) {
    errors.push("Số điện thoại là bắt buộc");
  } else if (!/^0[0-9]{9}$/.test(data.phone)) {
    errors.push(
      "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 chữ số)"
    );
  }

  // Validate email if it's editable
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate password if the user is updating with password
  if (data.isUpdating && !data.password) {
    errors.push("Vui lòng nhập mật khẩu để xác nhận thay đổi");
  }

  return errors;
};

export const validateFeedback = (data) => {
  const errors = [];

  // Validate feedback content
  if (!data.feedback) {
    errors.push("Nội dung phản hồi là bắt buộc");
  } else if (data.feedback.trim().length < 3) {
    errors.push("Nội dung phản hồi phải có ít nhất 3 ký tự");
  }

  return errors;
};

export const validateAppointment = (data) => {
  const errors = [];

  // Validate form (meeting type)
  if (!data.form) {
    errors.push("Hình thức cuộc họp là bắt buộc");
  } else if (data.form.trim().length < 2) {
    errors.push("Hình thức cuộc họp phải có ít nhất 2 ký tự");
  }

  // Validate location/link
  if (!data.meetAddress) {
    errors.push("Địa điểm/Link họp là bắt buộc");
  } else if (data.meetAddress.trim().length < 3) {
    errors.push("Địa điểm/Link họp phải có ít nhất 3 ký tự");
  }

  // Validate meeting time
  if (!data.timeMeeting) {
    errors.push("Thời gian họp là bắt buộc");
  } else {
    const currentTime = new Date();
    const meetingTime = new Date(data.timeMeeting);

    if (meetingTime <= currentTime) {
      errors.push("Thời gian họp phải lớn hơn thời gian hiện tại");
    }
  }

  // Validate description
  if (!data.desc) {
    errors.push("Mô tả cuộc họp là bắt buộc");
  } else if (data.desc.trim().length < 3) {
    errors.push("Mô tả cuộc họp phải có ít nhất 3 ký tự");
  }

  return errors;
};

export const validateDesignData = (data) => {
  const errors = [];

  // Validate basic fields
  if (!data.name || data.name.trim() === "") {
    errors.push("Tên thiết kế là bắt buộc");
  }

  if (!data.img || (Array.isArray(data.img) && data.img.length === 0)) {
    errors.push("Hình ảnh thiết kế là bắt buộc");
  }

  if (!data.categoryId) {
    errors.push("Danh mục thiết kế là bắt buộc");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Mô tả thiết kế là bắt buộc");
  }

  // Validate configurations
  if (!data.configurations || data.configurations.length === 0) {
    errors.push("Cấu hình sản phẩm là bắt buộc");
  } else {
    // Check for dimension configuration
    const dimensionConfig = data.configurations.find(
      (config) => config.name === "Kích thước (dài x rộng x cao cm)"
    );

    if (dimensionConfig) {
      for (const value of dimensionConfig.values) {
        if (!value.name.match(/^\d+\s*x\s*\d+\s*x\s*\d+$/)) {
          errors.push(
            `Giá trị "${value.name}" không đúng định dạng. Kích thước phải theo định dạng: "số x số x số"`
          );
        }
      }
    } else {
      errors.push("Cấu hình Kích thước (dài x rộng x cao cm) là bắt buộc");
    }
  }

  // Validate prices
  if (!data.prices || data.prices.length === 0) {
    errors.push("Bảng giá là bắt buộc");
  } else {
    for (const price of data.prices) {
      if (price.price < 100000) {
        errors.push("Giá phải từ 100.000đ trở lên");
      } else if (price.price > 50000000) {
        errors.push("Giá không được vượt quá 50.000.000đ");
      } else if (price.price % 100000 !== 0) {
        errors.push("Giá phải là bội số của 100.000đ");
      }
    }
  }

  return errors;
};
