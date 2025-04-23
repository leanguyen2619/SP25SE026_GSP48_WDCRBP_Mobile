import {
  Box,
  Button,
  HStack,
  Tooltip,
  Spinner,
  Text,
  Select,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  appColorTheme,
  serviceOrderStatusConstants,
} from "../../../../config/appconfig";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetServiceOrdersQuery } from "../../../../services/serviceOrderApi";
import useAuth from "../../../../hooks/useAuth";
import { formatPrice } from "../../../../utils/utils";

const ActionButton = (params) => {
  const navigate = useNavigate();
  const orderId = params.data.orderId;

  return (
    <HStack columnGap="4px">
      <Tooltip label="Chi tiết" hasArrow>
        <Button
          p="1px"
          onClick={() => navigate(`${orderId}`)}
          color={appColorTheme.brown_2}
          bg="none"
          border={`1px solid ${appColorTheme.brown_2}`}
          _hover={{ bg: appColorTheme.brown_2, color: "white" }}
        >
          <FiEye />
        </Button>
      </Tooltip>
    </HStack>
  );
};

// Map between display values and API values for service types
const serviceTypeMap = {
  "Tùy chỉnh": "Customization",
  "Cá nhân hóa": "Personalization",
  "Mua hàng": "Sale",
};

// Reverse lookup for display names
const getServiceTypeDisplayName = (apiValue) => {
  for (const [display, api] of Object.entries(serviceTypeMap)) {
    if (api === apiValue) return display;
  }
  return apiValue;
};

export default function ServiceOrderList() {
  const { auth } = useAuth();
  const gridRef = useRef();
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(serviceOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetServiceOrdersQuery({
    id: auth?.wwId,
    role: "Woodworker",
  });

  // Set initial filtered data when API data is loaded
  useEffect(() => {
    if (apiResponse?.data) {
      setFilteredData(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter data when filters change
  useEffect(() => {
    if (!apiResponse?.data) return;

    let filtered = apiResponse.data;

    // Apply status filter if selected
    if (statusFilter !== "") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply service type filter if selected
    if (serviceTypeFilter !== "") {
      const apiServiceType = serviceTypeMap[serviceTypeFilter];
      filtered = filtered.filter(
        (item) => item.service?.service?.serviceName === apiServiceType
      );
    }

    setFilteredData(filtered);
  }, [statusFilter, serviceTypeFilter, apiResponse]);

  const colDefs = useMemo(
    () => [
      {
        headerName: "Mã đơn hàng",
        field: "orderId",
        sort: "desc",
      },
      {
        headerName: "Loại dịch vụ",
        valueGetter: (params) => {
          const serviceName =
            params.data.service?.service?.serviceName || "N/A";
          return getServiceTypeDisplayName(serviceName);
        },
      },
      {
        headerName: "Tổng tiền",
        field: "totalAmount",
        valueFormatter: (p) => {
          if (!p.value) {
            return "Chưa cập nhật";
          }

          return formatPrice(p.value);
        },
      },
      {
        headerName: "SĐT k.hàng",
        valueGetter: (params) => params.data.user?.phone || "N/A",
      },
      {
        headerName: "Trạng thái",
        field: "status",
      },
      {
        headerName: "Cần lắp đặt",
        field: "install",
      },
      {
        headerName: "Cần phản hồi?",
        valueGetter: (params) => {
          if (params?.data?.role == "Woodworker") {
            return "Cần bạn phản hồi";
          } else if (params?.data?.role == "Customer") {
            return "Chờ phản hồi từ khách hàng";
          }
        },
        cellRenderer: (params) => {
          return params.value === "Cần bạn phản hồi" ? (
            <Text color="green.500">{params.value}</Text>
          ) : (
            <Text>{params.value}</Text>
          );
        },
      },
      {
        headerName: "Thao tác",
        cellRenderer: ActionButton,
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleServiceTypeFilterChange = (e) => {
    setServiceTypeFilter(e.target.value);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="500px"
      >
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="500px"
      >
        <Text color="red.500">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack mb={4} spacing={4}>
        <HStack>
          <Text fontWeight="medium">Lọc theo loại dịch vụ:</Text>
          <Select
            width="200px"
            bgColor="white"
            value={serviceTypeFilter}
            onChange={handleServiceTypeFilterChange}
          >
            <option value="">Tất cả dịch vụ</option>
            <option value="Tùy chỉnh">Tùy chỉnh</option>
            <option value="Cá nhân hóa">Cá nhân hóa</option>
            <option value="Mua hàng">Mua hàng</option>
          </Select>
        </HStack>

        <HStack>
          <Text fontWeight="medium">Lọc theo trạng thái:</Text>
          <Select
            width="300px"
            bgColor="white"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Tất cả trạng thái</option>
            {statusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>

      <Box>
        <div
          className="ag-theme-quartz"
          style={{ height: 700, fontSize: "16px" }}
        >
          <AgGridReact
            ref={gridRef}
            pagination
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            defaultColDef={defaultColDef}
            rowData={filteredData}
            columnDefs={colDefs}
          />
        </div>
      </Box>
    </Box>
  );
}
