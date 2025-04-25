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
import { appColorTheme } from "../../../../config/appconfig.js";
import { useMemo, useState } from "react";
import DesignCreateModal from "../ActionModal/DesignCreateModal.jsx";
import DesignDetailModal from "../ActionModal/DesignDetailModal.jsx";
import DesignUpdateModal from "../ActionModal/DesignUpdateModal.jsx";
import DesignDeleteModal from "../ActionModal/DesignDeleteModal.jsx";
import { useGetAllDesignIdeasByWoodworkerQuery } from "../../../../services/designIdeaApi";
import useAuth from "../../../../hooks/useAuth.js";
import RequireServicePack from "../../../../components/Utility/RequireServicePack.jsx";

export default function DesignManagementListPage() {
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;

  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useGetAllDesignIdeasByWoodworkerQuery(woodworkerId);

  const rowData = useMemo(() => {
    return apiData?.data || [];
  }, [apiData]);

  const [colDefs] = useState([
    { headerName: "Mã thiết kế", field: "designIdeaId", sort: "desc" },
    { headerName: "Tên thiết kế", field: "name" },
    { headerName: "Mô tả", field: "description" },
    {
      headerName: "Danh mục",
      valueGetter: (params) => params.data?.category?.categoryName || "N/A",
    },
    {
      headerName: "Thao tác",
      cellRenderer: ({ data }) => {
        return (
          <HStack spacing={1}>
            <DesignDetailModal data={data} refetch={refetch} />
            <DesignUpdateModal design={data} refetch={refetch} />
            <DesignDeleteModal design={data} refetch={refetch} />
          </HStack>
        );
      },
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      floatingFilter: true,
      // flex: 1,
    };
  }, []);

  if (isLoading) {
    return (
      <Center h="500px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="500px">
        <Text color="red.500">
          Error loading designs: {error.message || "Unknown error"}
        </Text>
      </Center>
    );
  }

  return (
    <RequireServicePack>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading
            color={appColorTheme.brown_2}
            as="h2"
            fontSize="2xl"
            fontFamily="Montserrat"
          >
            Quản lý Ý tưởng thiết kế
          </Heading>
          <DesignCreateModal refetch={refetch} />
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
              rowData={rowData}
              columnDefs={colDefs}
            />
          </div>
        </Box>
      </Stack>
    </RequireServicePack>
  );
}
