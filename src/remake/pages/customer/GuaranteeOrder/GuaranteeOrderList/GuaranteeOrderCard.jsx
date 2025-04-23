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
  getGuaranteeOrderStatusColor,
} from "../../../../config/appconfig";
import {
  formatPrice,
  formatDateTimeToVietnamese,
} from "../../../../utils/utils";

const GuaranteeOrderCard = ({ order, onViewDetails }) => {
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
          <Flex alignItems="center" gap={4}>
            <Heading size="md" fontWeight="bold">
              Mã yêu cầu: #{order.guaranteeOrderId}
            </Heading>
          </Flex>
          <Badge
            colorScheme={getGuaranteeOrderStatusColor(order.status)}
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
                Xưởng mộc:
              </Text>
              <Link
                href={`/woodworker/${order.woodworker?.woodworkerId}`}
                target="_blank"
                color={appColorTheme.brown_2}
              >
                <Text>{order.woodworker?.brandName || "N/A"}</Text>
              </Link>
            </Flex>

            <Flex mt={1}>
              <Text fontWeight="medium" minWidth="110px">
                Mã sản phẩm:
              </Text>
              <Text>
                #{order.requestedProduct?.requestedProductId || "N/A"}
              </Text>
            </Flex>

            <Flex mt={1}>
              <Text fontWeight="medium" minWidth="110px">
                Phân loại:
              </Text>
              <Text>
                {order.requestedProduct?.category?.categoryName ||
                  "Không có thông tin"}
              </Text>
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

            <Flex mt={1}>
              <Text fontWeight="medium" minWidth="110px">
                Hình thức:
              </Text>
              <Text>{order?.isGuarantee ? "Bảo hành" : "Sửa chữa"}</Text>
            </Flex>
          </GridItem>
        </Grid>
      </CardBody>

      <Divider />

      <CardFooter
        pt={2}
        pb={3}
        justifyContent="space-between"
        alignItems="center"
      >
        {order.totalAmount ? (
          <Text fontSize="lg" fontWeight="bold" color={appColorTheme.brown_2}>
            {formatPrice(order.totalAmount)}
          </Text>
        ) : (
          <Text>Chưa cập nhật</Text>
        )}

        <Button
          onClick={() => onViewDetails(order.guaranteeOrderId)}
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

export default GuaranteeOrderCard;
