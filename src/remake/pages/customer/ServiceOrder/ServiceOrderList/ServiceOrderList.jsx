import {
  Box,
  Spinner,
  Text,
  Select,
  Flex,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import {
  appColorTheme,
  serviceOrderStatusConstants,
} from "../../../../config/appconfig";
import { useNavigate } from "react-router-dom";
import { useGetServiceOrdersQuery } from "../../../../services/serviceOrderApi";
import useAuth from "../../../../hooks/useAuth";
import ServiceOrderCard from "./ServiceOrderCard";
import Pagination from "../../../../components/Utility/Pagination";

// Map between display values and API values for service types
const serviceTypeMap = {
  "Tùy chỉnh": "Customization",
  "Cá nhân hóa": "Personalization",
  "Mua hàng": "Sale",
};

// Component to render order items (will be passed to Pagination)
const ServiceOrderListItems = ({ data, onViewDetails }) => {
  return (
    <Stack spacing={4}>
      {data.length > 0 ? (
        data.map((order) => (
          <ServiceOrderCard
            key={order.orderId}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">Không có đơn hàng nào phù hợp với bộ lọc.</Text>
        </Box>
      )}
    </Stack>
  );
};

export default function ServiceOrderList() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("orderIdDesc");
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
    id: auth?.userId,
    role: "Customer",
  });

  // Set initial filtered data when API data is loaded
  useEffect(() => {
    if (apiResponse?.data) {
      setFilteredData(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter and sort data when filters or sort option changes
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

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "orderIdAsc":
          return a.orderId - b.orderId;
        case "orderIdDesc":
          return b.orderId - a.orderId;
        default:
          return b.orderId - a.orderId;
      }
    });

    setFilteredData(sorted);
  }, [statusFilter, serviceTypeFilter, sortOption, apiResponse]);

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleServiceTypeFilterChange = (e) => {
    setServiceTypeFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleViewDetails = (orderId) => {
    navigate(`${orderId}`);
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
      <Flex mb={4} gap={4} flexWrap="wrap">
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

        <HStack>
          <Text fontWeight="medium">Sắp xếp theo:</Text>
          <Select
            width="250px"
            bgColor="white"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="orderIdDesc">Mã giảm dần</option>
            <option value="orderIdAsc">Mã tăng dần</option>
          </Select>
        </HStack>
      </Flex>

      {filteredData.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">Không có đơn hàng nào phù hợp với bộ lọc.</Text>
        </Box>
      ) : (
        <Pagination
          dataList={filteredData}
          DisplayComponent={(props) => (
            <ServiceOrderListItems
              {...props}
              onViewDetails={handleViewDetails}
            />
          )}
          itemsPerPage={10}
        />
      )}
    </Box>
  );
}
