import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useMemo } from "react";
import { appColorTheme } from "../../../../config/appconfig";
import ProductCreateModal from "../ActionModal/ProductCreateModal";
import ProductDetailModal from "../ActionModal/ProductDetailModal";
import ProductUpdateModal from "../ActionModal/ProductUpdateModal";
import ProductDeleteModal from "../ActionModal/ProductDeleteModal";
import { formatPrice } from "../../../../utils/utils";
import { useGetProductsByWoodworkerIdQuery } from "../../../../services/productApi";
import useAuth from "../../../../hooks/useAuth";
import RequireServicePack from "../../../../components/Utility/RequireServicePack";

export default function ProductManagementListPage() {
  const { auth } = useAuth();

  // Fetch products data from API
  const { data, isLoading, isError, refetch } =
    useGetProductsByWoodworkerIdQuery(auth?.wwId, {
      skip: !auth?.wwId,
    });

  const products = data?.data || [];

  const [colDefs] = useState([
    { headerName: "Mã SP", field: "productId", sort: "desc" },
    { headerName: "Danh mục", field: "categoryName" },
    { headerName: "Tên sản phẩm", field: "productName" },
    {
      headerName: "Giá",
      field: "price",
      valueFormatter: (params) => formatPrice(params.value),
    },
    { headerName: "Tồn kho", field: "stock" },
    { headerName: "Loại gỗ", field: "woodType" },
    {
      headerName: "Thao tác",
      cellRenderer: ({ data }) => (
        <HStack spacing={1}>
          <ProductDetailModal product={data} />
          <ProductUpdateModal product={data} refetch={refetch} />
          <ProductDeleteModal product={data} refetch={refetch} />
        </HStack>
      ),
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      floatingFilter: true,
      flex: 1,
    }),
    []
  );

  if (isLoading) {
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
    <RequireServicePack>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading
            color={appColorTheme.brown_2}
            fontSize="2xl"
            fontFamily="Montserrat"
          >
            Quản lý Sản phẩm
          </Heading>
          <ProductCreateModal refetch={refetch} />
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
              rowData={products}
              columnDefs={colDefs}
            />
          </div>
        </Box>
      </Stack>
    </RequireServicePack>
  );
}
