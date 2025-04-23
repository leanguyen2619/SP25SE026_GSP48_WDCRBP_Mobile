import { Heading, Stack } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { appColorTheme } from "../../../../config/appconfig";
import GuaranteeOrderList from "./GuaranteeOrderList";

export default function WWGuaranteeOrderListPage() {
  return (
    <Stack spacing={6}>
      <Heading
        color={appColorTheme.brown_2}
        as="h2"
        fontSize="2xl"
        fontFamily="Montserrat"
      >
        Đơn đặt dịch vụ bảo hành, sửa chữa
      </Heading>

      <GuaranteeOrderList />
    </Stack>
  );
}
