import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import {
  appColorTheme,
  complaintStatusConstants,
} from "../../../../config/appconfig";
import ComplaintCreateModal from "../ActionModal/ComplaintCreateModal";
import { useGetUserComplaintsQuery } from "../../../../services/complaintApi";
import useAuth from "../../../../hooks/useAuth";
import { useGetServiceOrdersQuery } from "../../../../services/serviceOrderApi";
import Pagination from "../../../../components/Utility/Pagination";
import ComplaintCard from "./ComplaintCard";

// Component to render complaint items (will be passed to Pagination)
const ComplaintListItems = ({ data, refetch }) => {
  return (
    <Stack spacing={4}>
      {data.length > 0 ? (
        data.map((complaint) => (
          <ComplaintCard
            key={complaint.complaintId}
            complaint={complaint}
            refetch={refetch}
          />
        ))
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">Không có khiếu nại nào phù hợp với bộ lọc.</Text>
        </Box>
      )}
    </Stack>
  );
};

export default function CustomerComplaintPage() {
  const { auth } = useAuth();
  const { data, isLoading, isError, refetch } = useGetUserComplaintsQuery(
    auth?.userId
  );

  // Get service orders for the user
  const { data: ordersData, isLoading: isLoadingOrders } =
    useGetServiceOrdersQuery(
      {
        id: auth?.userId,
        role: "Customer",
      },
      { skip: !auth?.userId }
    );

  const complaints = data?.data || [];
  const serviceOrders = ordersData?.data || [];

  // Filtering states
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("complaintIdDesc");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  // Get status values from constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(complaintStatusConstants);
  }, []);

  // Apply filters and sorting when necessary
  useEffect(() => {
    if (!complaints) return;

    let filtered = [...complaints];

    // Apply status filter if selected
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "complaintIdAsc":
          return a.complaintId - b.complaintId;
        case "complaintIdDesc":
        default:
          return b.complaintId - a.complaintId;
      }
    });

    setFilteredComplaints(sorted);
  }, [complaints, statusFilter, sortOption]);

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  if (isLoading || isLoadingOrders) {
    return (
      <Center h="500px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="500px">
        <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </Center>
    );
  }

  return (
    <Stack spacing={6}>
      <Flex justify="space-between" align="center">
        <Heading
          color={appColorTheme.brown_2}
          fontSize="2xl"
          fontFamily="Montserrat"
        >
          Quản lý Khiếu nại
        </Heading>
        <ComplaintCreateModal refetch={refetch} serviceOrders={serviceOrders} />
      </Flex>

      <Flex mb={4} gap={4} flexWrap="wrap">
        <HStack>
          <Text fontWeight="medium">Lọc theo trạng thái:</Text>
          <Select
            width="200px"
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
            <option value="complaintIdDesc">Mã khiếu nại giảm dần</option>
            <option value="complaintIdAsc">Mã khiếu nại tăng dần</option>
          </Select>
        </HStack>
      </Flex>

      {filteredComplaints.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">Không có khiếu nại nào phù hợp với bộ lọc.</Text>
        </Box>
      ) : (
        <Pagination
          dataList={filteredComplaints}
          DisplayComponent={(props) => (
            <ComplaintListItems {...props} refetch={refetch} />
          )}
          itemsPerPage={5}
        />
      )}
    </Stack>
  );
}
