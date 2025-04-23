import {
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Flex,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import {
  appColorTheme,
  getServiceOrderStatusColor,
} from "../../../../config/appconfig";
import {
  formatPrice,
  formatDateTimeToVietnamese,
} from "../../../../utils/utils";

// Reverse lookup for display names
const getServiceTypeDisplayName = (apiValue) => {
  const serviceTypeMap = {
    Customization: "Tùy chỉnh",
    Personalization: "Cá nhân hóa",
    Sale: "Mua hàng",
  };

  return serviceTypeMap[apiValue] || apiValue;
};

const ServiceOrderCard = ({ order, onViewDetails }) => {
  return (
    <Card
      overflow="hidden"
      variant="outline"
      boxShadow="sm"
      borderColor="gray.200"
      transition="all 0.3s"
      _hover={{ boxShadow: "md", borderColor: appColorTheme.brown_2 }}
      width="100%"
    >
      <CardHeader bg="gray.50" py={3}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="bold">
            Mã đơn: #{order.orderId}
          </Heading>

          <Badge
            colorScheme={getServiceOrderStatusColor(order.status)}
            px={2}
            py={1}
          >
            {order.status}
          </Badge>
        </Flex>
      </CardHeader>

      <CardBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {/* Left Column */}
          <GridItem>
            <Flex>
              <Text fontWeight="medium" minWidth="110px">
                Loại dịch vụ:
              </Text>
              <Text>
                {getServiceTypeDisplayName(
                  order.service?.service?.serviceName || "N/A"
                )}
              </Text>
            </Flex>

            <Flex mt={1}>
              <Text fontWeight="medium" minWidth="110px">
                Xưởng mộc:
              </Text>
              <Link
                href={`/woodworker/${order.service?.wwDto?.woodworkerId}`}
                target="_blank"
                color={appColorTheme.brown_2}
              >
                <Text>{order.service?.wwDto?.brandName || "N/A"}</Text>
              </Link>
            </Flex>
          </GridItem>

          {/* Right Column */}
          <GridItem>
            <Flex>
              <Text fontWeight="medium" minWidth="110px">
                Lắp đặt:
              </Text>
              <Text>{order.install ? "Có" : "Không"}</Text>
            </Flex>

            <Flex mt={1}>
              <Text fontWeight="medium" minWidth="110px">
                Ngày tạo:
              </Text>
              <Text>{formatDateTimeToVietnamese(order.createdAt)}</Text>
            </Flex>
          </GridItem>
        </Grid>
      </CardBody>

      <Divider />

      <CardFooter
        pt={2}
        pb={3}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {order.totalAmount && (
          <Text fontSize="lg" fontWeight="bold" color={appColorTheme.brown_2}>
            {formatPrice(order.totalAmount)}
          </Text>
        )}

        <Button
          onClick={() => onViewDetails(order.orderId)}
          color="white"
          bg={appColorTheme.brown_2}
          leftIcon={<FiEye />}
          _hover={{ bg: appColorTheme.brown_1 }}
          size="sm"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceOrderCard;
