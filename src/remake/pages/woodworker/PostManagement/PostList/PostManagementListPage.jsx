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
import PostCreateModal from "../ActionModal/PostCreateModal";
import PostDetailModal from "../ActionModal/PostDetailModal";
import PostUpdateModal from "../ActionModal/PostUpdateModal";
import PostDeleteModal from "../ActionModal/PostDeleteModal";
import { appColorTheme } from "../../../../config/appconfig";
import { useGetWoodworkerPostsQuery } from "../../../../services/postApi";
import useAuth from "../../../../hooks/useAuth";
import { formatDateTimeString } from "../../../../utils/utils";
import RequireServicePack from "../../../../components/Utility/RequireServicePack";

export default function PostManagementListPage() {
  const { auth } = useAuth();

  const { data, isLoading, isError, refetch } = useGetWoodworkerPostsQuery(
    auth?.wwId
  );

  const posts = data?.data?.map((post) => {
    return {
      ...post,
      createdAt: new Date(post.createdAt),
    };
  });

  const [colDefs] = useState([
    { headerName: "Mã bài viết", field: "postId", sort: "desc" },
    { headerName: "Tiêu đề", field: "title" },
    {
      headerName: "Ngày tạo",
      field: "createdAt",
      valueFormatter: (params) => formatDateTimeString(params.value),
    },
    {
      headerName: "Thao tác",
      cellRenderer: ({ data }) => {
        return (
          <HStack spacing={2}>
            <PostDetailModal post={data} />
            <PostUpdateModal post={data} refetch={refetch} />
            <PostDeleteModal post={data} refetch={refetch} />
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
            Quản lý Bài viết
          </Heading>
          <PostCreateModal refetch={refetch} />
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
              rowData={posts || []}
              columnDefs={colDefs}
            />
          </div>
        </Box>
      </Stack>
    </RequireServicePack>
  );
}
