import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useMemo } from "react";
import {
  appColorTheme,
  transactionTypeColorMap,
  transactionTypeConstants,
} from "../../../../config/appconfig";
import TransactionDetailModal from "../ActionModal/TransactionDetailModal";
import { formatDateTimeString, formatPrice } from "../../../../utils/utils";
import WalletInformation from "../WalletInformation/WalletInformation";
import { useGetUserTransactionsQuery } from "../../../../services/transactionApi";
import useAuth from "../../../../hooks/useAuth";

export default function WalletManagementListPage() {
  const { auth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
  } = useGetUserTransactionsQuery(auth?.userId);

  const transactions = response?.data?.map((transaction) => {
    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
    };
  });

  const [colDefs] = useState([
    { headerName: "Mã giao dịch", field: "transactionId" },
    {
      headerName: "Loại giao dịch",
      field: "transactionType",
      cellStyle: (params) => {
        return { color: transactionTypeColorMap[params.value] };
      },
    },
    {
      headerName: "Số tiền",
      field: "amount",
      valueFormatter: (params) => {
        if (
          (params.data?.transactionType == transactionTypeConstants.NAP_VI ||
            params.data?.transactionType ==
              transactionTypeConstants.NHAN_TIEN ||
            params.data?.transactionType ==
              transactionTypeConstants.HOAN_TIEN) &&
          params.data?.status == true
        ) {
          return `+ ${formatPrice(params.value)}`;
        } else if (
          (params.data?.transactionType == transactionTypeConstants.RUT_VI ||
            params.data?.transactionType ==
              transactionTypeConstants.THANH_TOAN_BANG_VI ||
            params.data?.transactionType ==
              transactionTypeConstants.TRU_HOAN_TIEN) &&
          params.data?.status == true
        ) {
          return `- ${formatPrice(params.value)}`;
        }

        if (params.data?.status == true) {
          return `${formatPrice(params.value)}`;
        }

        return `${formatPrice(params.value)}`;
      },
      cellStyle: (params) => {
        if (
          params.data?.status == true &&
          (params.data?.transactionType == transactionTypeConstants.NAP_VI ||
            params.data?.transactionType ==
              transactionTypeConstants.NHAN_TIEN ||
            params.data?.transactionType == transactionTypeConstants.HOAN_TIEN)
        ) {
          return { color: appColorTheme.brown_2, fontWeight: "bold" };
        } else if (params.data?.status == true) {
          return { color: appColorTheme.red_0, fontWeight: "bold" };
        } else {
          return { color: "grey", fontWeight: "bold" };
        }
      },
    },
    {
      headerName: "Ngày tạo",
      field: "createdAt",
      valueFormatter: (params) => formatDateTimeString(params.value),
      sort: "desc",
    },
    {
      headerName: "Trạng thái",
      field: "status",
    },
    {
      headerName: "Thao tác",
      cellRenderer: ({ data }) => {
        return (
          <HStack spacing={1}>
            <TransactionDetailModal transaction={data} />
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
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text>Đã có lỗi xảy ra khi tải danh sách giao dịch</Text>
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
          Quản lý Ví
        </Heading>
      </Flex>

      <WalletInformation />

      <Box>
        <Heading
          color={appColorTheme.brown_2}
          fontSize="2xl"
          fontFamily="Montserrat"
        >
          Các khoản giao dịch
        </Heading>
      </Box>

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
            rowData={transactions || []}
            columnDefs={colDefs}
          />
        </div>
      </Box>
    </Stack>
  );
}
