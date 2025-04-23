import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiPenTool,
  FiSettings,
  FiStar,
  FiTool,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { appColorTheme } from "../../../config/appconfig";

const QuickActionCard = ({ icon, title, description, onClick, color }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      cursor="pointer"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      transition="all 0.2s"
      onClick={onClick}
    >
      <VStack spacing={4} align="start">
        <Box
          p={3}
          bg={`${color}.50`}
          color={color}
          borderRadius="lg"
          fontSize="2xl"
        >
          <Icon as={icon} />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default function WoodworkerWelcomePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const packType =
    auth?.woodworker?.servicePackEndDate &&
    Date.now() <= new Date(auth?.woodworker?.servicePackEndDate).getTime()
      ? auth?.woodworker?.servicePack?.name
      : null;

  const quickActions = [
    {
      icon: FiFileText,
      title: "Thêm bài đăng mới",
      description: "Đăng tải bài đăng mới của bạn",
      color: "blue",
      onClick: () => navigate("/ww/post"),
    },
    {
      icon: FiSettings,
      title: "Cài đặt xưởng",
      description: "Cập nhật thông tin xưởng của bạn",
      color: "purple",
      onClick: () => navigate("/ww/profile"),
    },
    {
      icon: FiDollarSign,
      title: "Quản lý gói dịch vụ",
      description: "Xem và nâng cấp gói dịch vụ",
      color: "green",
      onClick: () => navigate("/ww/profile"),
    },
    {
      icon: FiUser,
      title: "Quản lý đơn hàng",
      description: "Xem và xử lý đơn hàng",
      color: "orange",
      onClick: () => navigate("/ww/service-order"),
    },
    {
      icon: FiStar,
      title: "Xem đánh giá",
      description: "Xem đánh giá của khách hàng",
      color: "red",
      onClick: () => navigate("/ww/review"),
    },
    {
      icon: FiPenTool,
      title: "Thêm thiết kế",
      description: "Thêm thiết kế mới",
      color: "pink",
      onClick: () => navigate("/ww/design"),
    },
    {
      icon: FiCreditCard,
      title: "Xem ví",
      description: "Xem ví của bạn",
      color: "cyan",
      onClick: () => navigate("/ww/wallet"),
    },
    {
      icon: FiTool,
      title: "Xem dịch vụ",
      description: "Xem dịch vụ của bạn",
      color: "teal",
      onClick: () => navigate("/ww/service"),
    },
  ];

  return (
    <Box p={5}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb={6}
      >
        <VStack align="start" spacing={2}>
          <Heading size="lg">
            Xin chào, {auth?.woodworker?.brandName || "Xưởng mộc"}
          </Heading>
          <Text color="gray.500">
            Chào mừng bạn đến với trang quản lý xưởng mộc
          </Text>
        </VStack>
        {packType && (
          <Button
            bgColor={appColorTheme.brown_2}
            _hover={{
              bgColor: appColorTheme.brown_1,
              color: "white",
            }}
            color="white"
            leftIcon={<FiHome />}
            onClick={() => navigate(`/woodworker/${auth?.wwId}`)}
          >
            Xem xưởng của bạn
          </Button>
        )}
      </Flex>

      {packType ? (
        <>
          <Heading size="md" mb={6}>
            Thao tác nhanh
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={5}
          >
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Heading size="md" mb={6}>
            Mua gói dịch vụ
          </Heading>

          <QuickActionCard
            {...{
              icon: FiDollarSign,
              title: "Quản lý gói dịch vụ",
              description: "Xem và nâng cấp gói dịch vụ",
              color: "green",
              onClick: () => navigate("/ww/profile"),
            }}
          />
        </>
      )}
    </Box>
  );
}
