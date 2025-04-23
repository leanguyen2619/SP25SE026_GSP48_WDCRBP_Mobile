import { Heading, Stack } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ServiceOrderList from "./ServiceOrderList.jsx";
import { appColorTheme } from "../../../../config/appconfig";

export default function CusServiceOrderListPage() {
  return (
    <Stack spacing={6}>
      <Heading
        color={appColorTheme.brown_2}
        as="h2"
        fontSize="2xl"
        fontFamily="Montserrat"
      >
        Đơn đặt dịch vụ
      </Heading>

      <ServiceOrderList />
    </Stack>
  );
}
