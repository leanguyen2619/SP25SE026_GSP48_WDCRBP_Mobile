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
  guaranteeOrderStatusConstants,
} from "../../../../config/appconfig";
import { useNavigate } from "react-router-dom";
import { useGetGuaranteeOrdersQuery } from "../../../../services/guaranteeOrderApi";
import useAuth from "../../../../hooks/useAuth";
import GuaranteeOrderCard from "./GuaranteeOrderCard";
import Pagination from "../../../../components/Utility/Pagination";

// Component to render guarantee order items (will be passed to Pagination)
const GuaranteeOrderListItems = ({ data, onViewDetails }) => {
  return (
    <Stack spacing={4}>
      {data.length > 0 ? (
        data.map((order) => (
          <GuaranteeOrderCard
            key={order.guaranteeOrderId}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <Box textAlign="center" py={4}>
          <Text fontSize="lg">Không có đơn hàng nào phù hợp với bộ lọc.</Text>
        </Box>
      )}
    </Stack>
  );
};

export default function GuaranteeOrderList() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("orderIdDesc");
  const [filteredData, setFilteredData] = useState([]);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(guaranteeOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetGuaranteeOrdersQuery({
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

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "orderIdAsc":
          return a.guaranteeOrderId - b.guaranteeOrderId;
        case "orderIdDesc":
          return b.guaranteeOrderId - a.guaranteeOrderId;
        default:
          return b.guaranteeOrderId - a.guaranteeOrderId;
      }
    });

    setFilteredData(sorted);
  }, [statusFilter, sortOption, apiResponse]);

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
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
            <GuaranteeOrderListItems
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
