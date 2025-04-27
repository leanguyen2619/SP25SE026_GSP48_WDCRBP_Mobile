import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useMemo } from "react";
import { appColorTheme } from "../../../../config/appconfig";
import ReviewDetailModal from "../ActionModal/ReviewDetailModal";
import { formatDateTimeString } from "../../../../utils/utils";
import { FiStar } from "react-icons/fi";
import { useGetWoodworkerResponseReviewsQuery } from "../../../../services/reviewApi";
import useAuth from "../../../../hooks/useAuth";

export default function ReviewManagementListPage() {
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;

  // Fetch reviews that need woodworker response using the new endpoint
  const {
    data: reviewsResponse,
    refetch,
    isLoading,
    isError,
  } = useGetWoodworkerResponseReviewsQuery(woodworkerId, {
    skip: !woodworkerId,
  });

  // Transform data directly without useState and useEffect
  const reviews = reviewsResponse?.data?.map((el) => ({
    ...el,
    createdAt: new Date(el.createdAt),
  }));

  const [colDefs] = useState([
    {
      headerName: "Mã đánh giá",
      field: "reviewId",
      sort: "desc",
    },
    {
      headerName: "Loại đơn",
      valueGetter: (params) => {
        if (params.data.serviceOrderId) return "Đơn dịch vụ";
        if (params.data.guaranteeOrderId) return "Đơn BH / sửa";
        return "Không xác định";
      },
    },
    {
      headerName: "Mã đơn hàng",
      valueGetter: (params) =>
        params.data.serviceOrderId || params.data.guaranteeOrderId || "N/A",
    },
    {
      headerName: "Khách hàng",
      field: "username",
      valueFormatter: (params) => params.value || "Không có thông tin",
    },
    {
      headerName: "Đánh giá",
      field: "rating",
      cellRenderer: ({ value }) => {
        return (
          <HStack spacing={1}>
            {[...Array(5)].map((_, index) => (
              <FiStar
                key={index}
                color={index < value ? appColorTheme.brown_2 : "#CBD5E0"}
                size={16}
              />
            ))}
          </HStack>
        );
      },
    },
    {
      headerName: "Ngày tạo",
      field: "createdAt",
      valueFormatter: (params) => formatDateTimeString(params.value),
    },
    {
      headerName: "Thao tác",
      cellRenderer: ({ data }) => {
        return (
          <HStack spacing={1}>
            <ReviewDetailModal review={data} refetch={refetch} />
          </HStack>
        );
      },
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      floatingFilter: true,
      flex: 1,
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Center h="500px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Center h="500px">
        <Text color="red.500">Đã xảy ra lỗi khi tải dữ liệu.</Text>
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
          Quản lý Đánh giá
        </Heading>
      </Flex>

      <Box>
        <div
          className="ag-theme-quartz"
          style={{ height: 700, fontSize: "16px" }}
        >
          <AgGridReact
            pagination
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            defaultColDef={defaultColDef}
            rowData={reviews || []}
            columnDefs={colDefs}
            overlayNoRowsTemplate="Không có đánh giá nào cần phản hồi"
          />
        </div>
      </Box>
    </Stack>
  );
}
