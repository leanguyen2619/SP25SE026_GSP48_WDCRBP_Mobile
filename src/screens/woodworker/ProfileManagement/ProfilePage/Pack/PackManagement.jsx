import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  appColorTheme,
  getPackTypeLabel,
} from "../../../../../config/appconfig.js";
import PackageFrame from "../../../../../components/Utility/PackageFrame.jsx";
import BuyPackByWalletModal from "../../ActionModal/BuyPackByWalletModal.jsx";
import { formatDateTimeString } from "../../../../../utils/utils.js";
import BuyPackByPaymentGateway from "../../ActionModal/BuyPackByPaymentGateway.jsx";

export default function PackManagement({ woodworker }) {
  const walletModalDisclosure = useDisclosure();
  const paymentGatewayModalDisclosure = useDisclosure();

  const getPackColor = (type) => {
    switch (type?.toLowerCase()) {
      case "gold":
        return "yellow.500";
      case "silver":
        return "gray.400";
      case "bronze":
        return "orange.500";
      default:
        return "gray.500";
    }
  };

  return (
    <>
      <Heading
        color={appColorTheme.brown_2}
        fontSize="2xl"
        fontFamily="Montserrat"
      >
        Quản lý Gói dịch vụ
      </Heading>

      <PackageFrame packageType={woodworker.servicePack?.name}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            Thông tin gói dịch vụ
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box>
              <Text fontWeight="bold">Loại xưởng:</Text>
              <Text
                color={getPackColor(woodworker.servicePack?.name)}
                fontSize="xl"
              >
                {getPackTypeLabel(
                  woodworker.servicePack?.name
                )?.toUpperCase() || "Chưa đăng ký"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Ngày bắt đầu:</Text>
              <Text fontSize="xl">
                {woodworker.servicePackStartDate
                  ? formatDateTimeString(woodworker.servicePackStartDate)
                  : "Chưa đăng ký"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Ngày kết thúc:</Text>
              <Text fontSize="xl">
                {woodworker.servicePackStartDate
                  ? formatDateTimeString(woodworker.servicePackEndDate)
                  : "Chưa đăng ký"}
              </Text>
            </Box>
          </SimpleGrid>
          <HStack spacing={4} mb={4} mt={4}>
            <Button
              colorScheme="green"
              onClick={walletModalDisclosure.onOpen}
              leftIcon={<Text>+</Text>}
            >
              Mua bằng ví
            </Button>
            <Button
              colorScheme="blue"
              onClick={paymentGatewayModalDisclosure.onOpen}
              leftIcon={<Text>+</Text>}
            >
              Mua qua cổng thanh toán
            </Button>
          </HStack>

          <Link
            target="_blank"
            color={appColorTheme.brown_2}
            href="/upgrade-guide"
          >
            Xem hướng dẫn cách quy đổi ngày khi nâng cấp gói dịch vụ
          </Link>
        </Box>
      </PackageFrame>

      <BuyPackByWalletModal
        isOpen={walletModalDisclosure.isOpen}
        onClose={walletModalDisclosure.onClose}
        woodworker={woodworker}
      />
      <BuyPackByPaymentGateway
        isOpen={paymentGatewayModalDisclosure.isOpen}
        onClose={paymentGatewayModalDisclosure.onClose}
        woodworker={woodworker}
      />
    </>
  );
}
